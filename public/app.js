var app = angular.module("portalsApp", ['ui.router', 'xeditable']);

app.config(function($stateProvider, $urlRouterProvider) {

  // For any unmatched url, redirect to /home
  $urlRouterProvider.otherwise("/homeView"); 
  
  $stateProvider
    

    .state('admin', {
      url: "/admin",
      templateUrl: "html-templates/admin.html",
      controller: "adminCtrl"
    })

    .state("createAccount", {
    	url: "/createAccount",
    	templateUrl: "html-templates/createAccount.html",
    	controller: "loginCreateAccountCtrl"
    })

     .state('homeView', {
      url: "/homeView",
      templateUrl: "html-templates/homeView.html" 
    })

    .state('login', {
    	url: "/login",
    	templateUrl: "html-templates/login.html",
    	controller: "loginCreateAccountCtrl"
    })
    .state('logout',{
      url:"/homeView",
      templateUrl:"html-templates/homeView.html"
    })

    .state("portfolios", {
    	url: "/portfolios",
    	templateUrl: "html-templates/publicPortfolios.html",
    	controller: "publicPortfoliosCtrl"
    })

    .state("profiles", {
    	url: "/profiles",
    	templateUrl: "html-templates/publicStudentProfile.html",
    	controller: "studentProfileCtrl"
    })

});

app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

