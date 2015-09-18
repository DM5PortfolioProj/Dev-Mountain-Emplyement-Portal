app.service("studentProfileSvc", function($http, $q) {


  this.storeImage = function(imageData, filename) {
    var imageExtension = imageData.split(';')[0].split('/');
    imageExtension = imageExtension[imageExtension.length - 1];
    console.log(imageExtension);

    var newImage = {
      imageName: filename,
      imageBody: imageData,
      imageExtension: imageExtension,
      userEmail: 'ih8blackwidowspiders@gmail.com'
    }

    return $http.post('/api/newimage', newImage)
  }

  this.getStudentProf = function() {
    var deferred = $q.defer();
    $http({
      url: 'http://localhost:3000/api/studentPorftolio/' +
        '55fb28b28e2750f176378182',//
      method: 'GET',
      // data: data
    }).then(function(response) {
      console.log('this is response.data in service', response.data);
      deferred.resolve(response.data);
    })
    return deferred.promise;
  }

/*  this.getcohortNameCollection=function(){
    var deferred=$q.defer();
    $http({
      url: 'http://localhost:3000/api/cohortName',
      method: 'GET',
      // data: data
    }).then(function(response) {
console.log("cohort collection", response.data)
      deferred.resolve(response.data);
    })
    return deferred.promise;
  }*/
  this.getCohortName=function(){
    var deferred=$q.defer();
    $http({
      url: 'http://localhost:3000/api/cohortName',
      method: 'GET',
      // data: data
    }).then(function(response) {
      //console.log("cohort collection", response.data)
      deferred.resolve(response.data);
    })
    return deferred.promise;
  }
    this.addCohortName = function (product) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: 'http://localhost:3000/api/cohortName',
      data: {
        value: cohortName.value,
        text: cohortName.text
      }
    }).then(function (response) {
      deferred.resolve(response);
    });
    return deferred.promise;
  };
    this.deleteCohortName = function (cohortName) {
    var deferred = $q.defer();
    $http({
      method: 'DELETE',
      url: 'http://localhost:3000/api/cohortName/' + cohortName._id
    }).then(function (response) {
      deferred.resolve(response);
    });
    return deferred.promise;
  };



});
