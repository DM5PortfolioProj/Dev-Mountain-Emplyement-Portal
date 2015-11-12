//dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var LocalStrategy = require("passport-local").Strategy;
var session = require('express-session');
var multipart = require('connect-multiparty')
var morgan = require('morgan');
var axios = require('axios');

var config = require('./config.js');


var app = express();
var router = express.Router();

//controllers

var config = require('./controller/config.js');
var userCtrl = require('./controller/userCtrl');
var skillsCtrl = require('./controller/skillsCtrl');
var devSkillsCtrl = require('./controller/devSkillsCtrl');
var projectCtrl = require('./controller/projectCtrl');
var cohortNameCtrl = require('./controller/cohortNameCtrl');
var classNameCtrl = require('./controller/classNameCtrl');
var cohortLocationCtrl = require('./controller/cohortLocationCtrl');
var studentSkillsCtrl = require('./controller/studentSkillsCtrl');

var studentPortfCtrl = require('./controller/studentPortfCtrl');
var fullPortfolio = require('./controller/fullportfolio');
var authCtrl = require('./controller/authCtrl');
var projectsCtrl = require('./controller/projectsCtrl')
var imageController = require("./controller/imageController.js");

//middleware

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(session({
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true
}));
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);
app.use(cors());
app.use('/upload/image', multipart());
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));


//models

var User = require('./models/userSchema');
//passport

passport.use(new LocalStrategy({
    usernameField: "email"
  },
  function(email, password, callback) {
    console.log('this is passport use', email, password);
    User.findOne({
      email: email
    }, function(err, user) {
      console.log("this is passport.use error", err);
      if (err) {
        return callback(err);
      }
      // If user isn't found with that username
      if (!user) {
        return callback(null, false);
      }
      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) {
          return callback(err);
        }
        // Password did not match
        if (!isMatch) {
          return callback(null, false);
        }
        // Success
        return callback(null, user);
      });
    });
  }
));

//Serializing

passport.serializeUser(function(user, done) {
  console.log("userfound", done);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("deserializeUser");
  done(null, user);
});


//endpoints

app.post('/api/newimage', imageController.saveImage);

app.post('/login', function(req, res, next) {
  console.log('this is req', req.body);
  passport.authenticate('local', function(err, user, info) {
    console.log('this is login', user);
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log('user not found');
      return res.send('authentication failed');
    }
    req.logIn(user, function(err) {
      console.log('is logIn', user);
      if (err) {
        return next(err);
      }
      return res.send(user._id);
    });
  })(req, res, next);
});



/////////////Biginning of Dev Mountain Auth//////////////
//***********************************//
//authentication specific stuff starts here
//***********************************//

var jwt = require('jsonwebtoken');
// app name and client token should be given to you
var app_name = 'dev-ep' // your app name here
var client_token = 'something' // your client token here
var authenticationRedirectUrl = 'http://localhost:1337/login/?bounce=' +
  app_name + '&token=' + client_token;


// authentication endpoint will look like
// /auth/getToken/:state
var authRoutes = express.Router();
app.use('/auth', authRoutes);

authRoutes.get('/getSessionUser', function(req, res) {
  if (req.session.decoded) {
    res.send(req.session.decoded);
  } else {
    res.send();
  }
})

// allows app state or route to be passed here, saved in the session and redirected to after authentication
authRoutes.get('/getUser/:type', function(req, res) {

  // TODO remove hardcoded for testing

  if (req.params.type === 'admin') {
    req.session.decoded = {
      "email": "test2@test.com",
      "id": 94,
      "roles": [{
        "role": "admin",
        "id": 1
      }, {
        "role": "mentor",
        "id": 2
      }, {
        "role": "lead_instructor",
        "id": 3
      }],
      "iat": 1443128174,
      "exp": 1443214574
    }
  } else if (req.params.type === 'student') {
    req.session.decoded = {
      "email": "test@test.com",
      "id": 95,
      "roles": [{
        "role": "student",
        "id": 4
      }],
      _id: '55f8480baec60b07268b0f59',

      "iat": 1443128174,
      "exp": 1443214574
    }
  }

  // if the decoded token is already on the session, just pass it back
  if (req.session.decoded) {
    return res.status(200).json({
      user: req.session.decoded
    });
  }

  //else if no decoded token, pass redirect info back to app (cannot redirect in xhr request, must be handled by client)
  else {
    res.status(200).json({
      redirect: true,
      location: authenticationRedirectUrl
    })

  }
});


// this is where devmountain will redirect back to. Grabs the app state for redirection to that state or route (if passed in previous get)
authRoutes.get('/ms/callback', function(req, res) {
  var token = req.query.token;

  // if passed a token, decoded it and place it on the session. The decoded object is the user that has now been authenticated.
  if (token) {
    jwt.verify(token, config.jwtSecret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to verify token'
        });
      } else {

        //token is valid
        req.session.decoded = decoded;
        console.log(decoded);

        if (req.session.redirectState) {
          var tmp = req.session.redirectState || null
          delete req.session.redirectState;
        }
        console.log('redirecting')
        res.redirect('/#/' + tmp);
      }
    })
  } else {
    //else there is no token
    return (res.status(403).json({
      success: false,
      message: 'No token given'
    }))

  }

})

authRoutes.get('/logout', function(req, res) {
  delete req.session.decoded;
  res.status(200).send();
})



/////////////End of Dev Mountain Auth///////////////////



router.route('/api/user')
  .post(userCtrl.create)
  .get(authCtrl.isAuthenticated, userCtrl.read);

router.route('/api/skills')
  .post(authCtrl.isAuthenticated, skillsCtrl.create)
  .get(authCtrl.isAuthenticated, skillsCtrl.read);

router.route('/api/devskills')
  .post(authCtrl.isAuthenticated, devSkillsCtrl.create)
  .get(authCtrl.isAuthenticated, devSkillsCtrl.read);

router.route('/api/devskills/:id')
  .put(authCtrl.isAuthenticated, devSkillsCtrl.update)
  .delete(authCtrl.isAuthenticated, devSkillsCtrl.delete);

//Using this one to create new skill on StudentProfileEdit.html//////
router.route('/api/devskill/:studentId')
  .post(authCtrl.isAuthenticated, devSkillsCtrl.create);
router.route('/api/devskill/:id')
  .delete(devSkillsCtrl.delete)
  .put(devSkillsCtrl.update);

///////////////////////////////////////////////////////////////////////

router.route('/api/project/:studentId')
  .post(authCtrl.isAuthenticated, projectCtrl.create)
  .get(authCtrl.isAuthenticated, projectCtrl.read);
router.route('/api/project/:id')
  .delete(authCtrl.isAuthenticated, projectCtrl.delete);


router.route('/api/studentPorftolio')
  .post( /*authCtrl.isAuthenticated,*/ studentPortfCtrl.create);

router.route('/api/updateProject/:id')
  .put( /*authCtrl.isAuthenticated,*/ projectCtrl.update)
  .delete(authCtrl.isAuthenticated, projectCtrl.delete);

router.route('/api/projects')
  .get(projectsCtrl.read);

router.route('/api/studentPortfolio')
  .get(studentPortfCtrl.read);

router.route('/api/studentPortfolio/:id')
  .get(studentPortfCtrl.getStudentById) // Using This one for editable forms on PublicStudentProfile.html
  .post(authCtrl.isAuthenticated, studentPortfCtrl.create)
  .put(authCtrl.isAuthenticated, studentPortfCtrl.update)
  .delete(authCtrl.isAuthenticated, studentPortfCtrl.delete);

router.route('/api/cohortName')
  .post(authCtrl.isAuthenticated, cohortNameCtrl.create)
  .get(cohortNameCtrl.read);

router.route('/api/cohortName/:id')
  .put(authCtrl.isAuthenticated, cohortNameCtrl.update)
  .delete(authCtrl.isAuthenticated, cohortNameCtrl.delete);

router.route('/cohortLocation')
  .get(cohortLocationCtrl.read);

router.route('/api/cohortLocation')
  .post(authCtrl.isAuthenticated, cohortLocationCtrl.create)
  .get( /*authCtrl.isAuthenticated,*/ cohortLocationCtrl.read);

router.route('/api/cohortLocation/:id')
  .put(authCtrl.isAuthenticated, cohortLocationCtrl.update)
  .delete(authCtrl.isAuthenticated, cohortLocationCtrl.delete);

router.route('/api/className')
  .post(authCtrl.isAuthenticated, classNameCtrl.create)
  .get(authCtrl.isAuthenticated, classNameCtrl.read);

router.route('/api/className/:id')
  .put(authCtrl.isAuthenticated, classNameCtrl.update)
  .delete(authCtrl.isAuthenticated, classNameCtrl.delete);

router.route('/api/studentSkills')
  .post(authCtrl.isAuthenticated, studentSkillsCtrl.create)
  .get(authCtrl.isAuthenticated, studentSkillsCtrl.read);

router.route('/api/studentSkills/:id')
  .put(authCtrl.isAuthenticated, studentSkillsCtrl.update)
  .delete(authCtrl.isAuthenticated, studentSkillsCtrl.delete);
//the fullportfolio end point is for the publicStudentProfile.html view

router.route('/api/fullPortfolio/:id')
  .get(authCtrl.isAuthenticated, fullPortfolio.getPortfolio);

//this the end point for getting students by Cohort
router.route('/api/getCohort/:id')
  .get(studentPortfCtrl.getCohorts);

//this is the end point for getting student in public view

router.route('/api/student/:id')
  .get(studentPortfCtrl.getStudentById);


// Connections
var portNum = config.portNum;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  console.log('Mongoose:', mongooseUri);
});

var mongodbUri = 'mongodb://adriana:group@ds033317.mongolab.com:33317/devmtn';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri);

app.listen(portNum, function() {
  console.log('port:', portNum);
});
