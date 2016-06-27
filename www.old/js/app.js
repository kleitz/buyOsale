angular.module('starter', ['ionic','ngIOS9UIWebViewPatch','starter.controllers','starter.services','starter.directives'])

.run(function($ionicPlatform, $rootScope, $window, $ionicLoading, $ionicPopup) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $rootScope.show = function(text) {
    $rootScope.loading = $ionicLoading.show({
      template: text ? text : 'Loading...',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 500,
      showDelay: 0
    });
  };
  $rootScope.hide = function() {
    $ionicLoading.hide();
  };
})

.run(function($location, $state, $rootScope, AuthService, $window) {
  $rootScope.$on( "$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    if($window.localStorage.getItem('buyOsale_auth_token') !== undefined){
      //
    }
    else{
      if(toState.name !== 'login') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent' :{
        templateUrl: "templates/dashboard.html",
        controller: 'DashBoardController'
      }
    }
  })
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent' :{
        templateUrl: "templates/dashboard.html",
        controller: 'SearchController'
      }
    }
  })
  .state('app.category', {
    url: "/category/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "templates/dashboard.html",
        controller: 'CategoryController'
      }
    }
  })
  .state('app.checkout',{
    url: '/checkout',
    views: {
      'menuContent' :{
        templateUrl: "templates/checkout.html",
        controller: 'CheckoutController'
      }
    }
  })
  .state('app.forgot', {
    url: '/forgot',
    views: {
      'menuContent': {
        templateUrl: 'templates/forgotPassword.html',
        controller: 'ForgotPasswordController'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: "templates/login.html"
  })
;
  $urlRouterProvider.otherwise('/login');
});
