(function () {
  'use strict';

  angular
    .module('app.core')
    .controller('CoreCtrl', CoreCtrl);

  CoreCtrl.$inject = ['$rootScope', '$ionicHistory', '$ionicSideMenuDelegate', '$state'];

  /* @ngInject */
  function CoreCtrl($rootScope,$ionicHistory,$ionicSideMenuDelegate,$state) {
    var vm = this;
    vm.title = 'LoginController';
    $rootScope.isLoggedIn = false;
    vm.loginData = {};
  }

})();
