app.controller("loginCreateAccountCtrl", function($scope, $location, loginSvc) {


  $scope.login = function(data) {
    console.log('this is login data', data);
    loginSvc.logInUser(data).then(function(response) {
      console.log('this is login response', response);

      if (response === "authentication failed") {
        $scope.user = "";
        $location.path("/login");
      } else {
        $scope.user = "";
        $location.path("/profile");
        // $location.path("/profile/"+response);
      }
    })
  }

  $scope.register = function(data) {
    console.log('this is register data', data);
    loginSvc.register(data).then(function(response) {
      console.log('this is register response', response);
      $scope.user = "";
      $location.path("/profile");
    })
  }

});
