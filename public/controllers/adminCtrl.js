app.controller("adminCtrl", function($scope, adminSvc, cohortLocServ,
  classNameServ, cohortNameServ, $timeout, $mdUtil, $mdSidenav, $log) {


  //////SLIDER NAV BAR FUNCTION////////

  $scope.toggleLeft = buildToggler('left');

  function buildToggler(navID) {
    var debounceFn = $mdUtil.debounce(function() {
      $mdSidenav(navID)
        .toggle()
        .then(function() {
          $log.debug("toggle " + navID + " is done");
        });
    }, 200);
    return debounceFn;
  }
  $scope.close = function() {
    $mdSidenav('left').close()
      .then(function() {
        $log.debug("close LEFT is done");
      });
  };

  /////CRUD FUNCTIONS//////

  $scope.students = [];
  $scope.adminReadStudents = function() { //this functions gets the student profiles

    adminSvc.adminReadStudents().then(function(response) {
      // console.log("response from controller", response.data);
      $scope.students = response.data;
      // console.log("students from DB", $scope.students);
    });
  };
  $scope.adminReadStudents();


  $scope.showProfile = function(student) { ////this function changes boolean in database for the checkboxes
    console.log(student)
    adminSvc.adminUpdateShowStudent(student).then(function(response) {
      if (response.status === 200) {
        $scope.adminReadStudents();
      }
    });
  };

  $scope.adminUpdatePercent = function(percent, index, _id) { ////this function changes/updates the percent value
    $scope.students[index].percentCompleted = percent;
    if (percent < 0 || percent > 100) {
      alert(
        "Enter a number between 0 and 100. Your incorrect input did not save to the database"
      );
      $scope.adminReadStudents();
    }
    if (percent >= 0 && percent <= 100) {
      adminSvc.adminUpdatePercent(percent, _id).then(function(response) {
        if (response.status === 200) {
          $scope.adminReadStudents();
        }
      });
    }
  };

  /////GET AND POST FOR SIDE NAV//////

  var getCohortLocations = function() { ///this function gets cohort locations from DB
    cohortLocServ.getCohortLoc().then(function(response) {
      if (response.status === 200) {
        $scope.cohortLocations = response.data;
        // console.log("cohort locations response on controller from the service", response.data);
      }
    })
  }
  getCohortLocations();

  $scope.addNewLocation = function(newLoc) {
    // console.log("this is the newLoc before it goes to service", newLoc);
    cohortLocServ.addCohortLoc(newLoc).then(function(response) {
      // console.log("new location response", response)
      getCohortLocations();
      $scope.newLoc = "";
    })
  }

  var getCourseNames = function() {
    classNameServ.getClassName().then(function(response) {
      if (response.status === 200) {
        $scope.courseNames = response.data;
        // console.log("courseName response from controller", $scope.courseNames);
      }
    })
  }
  getCourseNames();

  $scope.addNewCourseName = function(newCourse) {
    classNameServ.addClassName(newCourse).then(function(response) {
      // console.log("addNewCourseName response on controller", response.data);
      getCourseName();
      $scope.newCourse = "";
    })
  }

  var getCohortNames = function() {
    console.log("get the cohort names in controller")
    cohortNameServ.getCohortNames().then(function(response) {
      $scope.cohortNames = response.data;
      console.log("getCohortNames response from DB", $scope.cohortNames);


    })
  }
  getCohortNames();

  $scope.addNewCohortName = function(newCohort) {
    cohortNameServ.addCohortName(newCohort).then(function(response) {
      console.log("new cohort name added", response);
      getCohortNames();
      $scope.newCohort = "";
    })
  }


  // $scope.delete = function(var, _id) {
  // 	adminSvc.delete(var, _id).then(function(response) {

  // 	});
  // };



});
