(function () {
  'use strict';

  angular
    .module('app.login')
    .config(config)
    .run(loginInterceptor)

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function config ($stateProvider, $urlRouterProvider) {
      $stateProvider
      .state('login', {
        url: "/login",
        templateUrl: "app/login/login.html",
        controller: 'LoginCtrl as lc'
      });
      $urlRouterProvider.otherwise('/login');
    }



    loginInterceptor.$inject = ['$state', '$rootScope', 'dataService', '$ionicPlatform'];

    function loginInterceptor($state, $rootScope, dataService, $ionicPlatform) {
      $rootScope.$on( "$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        $ionicPlatform.ready(function () {
          if(dataService.getToken() !== null){
            //got the token -> proceed with app execution...

            //console.log('got token -> proceed with app execution...');
            dataService.getCatalogueItems().then(function(result){
              //console.log('got the data - login.config');
              //console.log(result[0]);
            }, function(error){
              console.log('error');
            });
          }
          else{
            if(toState.name !== 'login') {
              event.preventDefault();
              $state.go('login');
            }
          }
        });
      });
    }

})();

