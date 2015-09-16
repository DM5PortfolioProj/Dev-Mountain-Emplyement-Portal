app.controller("studentProfileCtrl", function($scope, studentProfileSvc, $filter, $http) {

	$scope.studentProfilesTest =
		"This test is from the studentProfileCtrl file from $scope";

	$scope.getStudentProf = function() {
		studentProfileSvc.getStudentProf().then(function(response) {
			$scope.studentData = response;
			console.log(response);
		})
	};

	$scope.getStudentProf();
/*
$scope.url='';
$scope.checkforUrl=function(studentData){
	if (studentData.studentPortf.github !== null) {
		return $scope.url = studentData.studentPortf.github;
	} else{
		$scope.url = "http://github.com"
	};
}
$scope.checkforUrl();*/
 //var studentpicture=$scope.s3url; see how to save puc url from amazon to our student profile 

	
  $scope.user = {
    name: 'Name',
    midle:"M",
    lastname:'Last-Name',
    email:'your@email.com',
    pictureurl:'Upload you picture here',
    github: '',
    personalWebsite: 'Personal Website',
    linkdIn: 'Share your LinkdIn',
    Bio: 'Here is where you tell us about you',
 // link or upload to amazon s3 that saves link to resume.
   currentLoc: {
    city: 'City',
    state: 'State',
  	},
  	status: 0,
  	cohortLoc:0,

  }; 
  $scope.statuses =[
  	{value:0, text:'Status'},
  	{value:1, text:'Student'},
  	{value:2, text:'Unemployed'},
  	{value:3, text:'Employed'},
  	{value:4, text:'Freelance'}
  ];
  $scope.cohortLocations =[
  	{value:0, text:'Cohort Location'},
  	{value:1, text:'Dallas, Tx'},
  	{value:2, text:'SLC, UT'},
  	{value:3, text:'Provo, UT'},
  	
  ];

  $scope.cohortName =[
  	{value:0, text:'DM5'},
  	{value:1, text:'DM6'},
  	{value:2, text:'DM7'},
  	{value:3, text:'DM8'},
  	
  ];
    $scope.classNames =[
    {value:0, text:'Class Name'},
  	{value:1, text:'Web Development'},
  	{value:2, text:'IOS'},

  	
  ];
  $scope.updateStudent= function(student){

  }

  

});
