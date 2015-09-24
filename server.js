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

var app = express();
var router = express.Router();

//controllers

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
app.use(express.static('public'));
app.use(bodyParser.json({
  limit: '50mb'
}));
app.use(session({
  secret: "devmtnempportal",
  resave: true,
  saveUninitialized: true
}));
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

router.route('/api/project')
  .post(authCtrl.isAuthenticated, projectCtrl.create)
  .get(authCtrl.isAuthenticated, projectCtrl.read);

router.route('/api/studentPorftolio')
  .post(authCtrl.isAuthenticated, studentPortfCtrl.create);

router.route('/api/project/:id')
  .put(authCtrl.isAuthenticated, projectCtrl.update)
  .delete(authCtrl.isAuthenticated, projectCtrl.delete)

router.route('/api/projects')
  .get(projectsCtrl.read);

router.route('/api/studentPortfolio')
  .get(studentPortfCtrl.read);

router.route('/api/studentPortfolio/:id')
  .get(authCtrl.isAuthenticated, studentPortfCtrl.getStudentById) // Using This one for editable forms on PublicStudentProfile.html

.put(authCtrl.isAuthenticated, studentPortfCtrl.update)
  .delete(authCtrl.isAuthenticated, studentPortfCtrl.delete);

router.route('/api/cohortName')
  .post(authCtrl.isAuthenticated, cohortNameCtrl.create)
  .get(authCtrl.isAuthenticated, cohortNameCtrl.read);

router.route('/api/cohortName/:id')
  .put(authCtrl.isAuthenticated, cohortNameCtrl.update)
  .delete(authCtrl.isAuthenticated, cohortNameCtrl.delete);

router.route('/api/cohortLocation')
  .post(authCtrl.isAuthenticated, cohortLocationCtrl.create)
  .get(authCtrl.isAuthenticated, cohortLocationCtrl.read);

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

//connections
var mongodbUri = 'mongodb://adriana:group@ds033317.mongolab.com:33317/devmtn';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongodbUri);
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('Connected to mongodb @', mongodbUri);
})



var port = 3000;

var server = app.listen(process.env.PORT || port, function() {
  console.log('Server up and running at', server.address().port);
});
