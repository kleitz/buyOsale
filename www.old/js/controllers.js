angular.module('starter.controllers', [])


.controller('AppCtrl', function($scope,$rootScope,$ionicHistory,$ionicSideMenuDelegate,$state,Search) {
  $scope.search = Search;
  $scope.doSearch = function() {
    cordova.plugins.Keyboard.close();
    $ionicSideMenuDelegate.toggleLeft();
    $ionicHistory.nextViewOptions({disableBack: true});
    $state.go('app.search', {}, {reload: true});
  }
  $rootScope.isLoggedIn = false;
  $scope.loginData = {};

})


//.controller('LoginCtrl', function($scope, $ionicPopup, $state, DataServiceHTTP, AuthService, $ionicLoading) {
.controller('LoginCtrl', function($scope, $ionicPopup, $state, $ionicLoading) {
  $scope.loginData = {};

  //$scope.login = function(data) {
  //  $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
  //  AuthService.login($scope.data.phone_number, $scope.data.password).then(function(authenticated) {
  //    $ionicLoading.hide();
  //    $state.go('app.lead_module', {}, {reload: true});
  //    //$scope.setCurrentUsername($scope.data.phone_number);
  //  }, function(err) {
  //    $ionicLoading.hide();
  //    var alertPopup = $ionicPopup.alert({
  //      title: 'אימות נכשל!',
  //      template: 'אנא בדוק את הפרטים ונסה שנית!'
  //    });
  //  });
  //};

  $scope.login = function() {
    $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});
    if($scope.loginData.username == 'itay' && $scope.loginData.password == 'itay'){
      $ionicLoading.hide();
      $state.go('app.dashboard', {}, {reload: true});
    }
    else{
      $ionicLoading.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'אימות נכשל!',
        template: 'אנא בדוק את הפרטים ונסה שנית!'
      });
    }
  };
})


.controller('SearchController', function($scope,Search) {
  $scope.Title = "Searching for " + Search.query;
})


.controller('DashBoardController', function($scope) {
  $scope.Title = "DashBoard";
})


.controller('CategoryController', function($scope,$stateParams) {
})


.controller('CheckoutController', function($scope) {
});
