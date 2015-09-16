app.service("publicPortfoliosSvc", function($http, $q) {

  this.getStudentProf = function() {
    var deferred = $q.defer();
    $http({
      url: 'http://localhost:3000/api/studentPorftolio',
      method: 'GET',
    }).then(function(response) {
      console.log('this is response.data in service', response.data);
      deferred.resolve(response.data);
    })
    return deferred.promise;
  }

  this.getStudentProj = function() {
      var deferred = $q.defer();
      $http({
        url: 'http://localhost:3000/api/studentPorftolio',
        method: 'GET',
      }).then(function(response) {
        console.log('this is response.data in service', response.data);
        deferred.resolve(response.data);
      })
      return deferred.promise;
    }
    //end service

});
