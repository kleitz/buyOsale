(function () {
  'use strict';

  angular
    .module('app.core')
    .run(runIonicStartUp)
    .config(config)


    runIonicStartUp.$inject = ['$ionicPlatform', '$rootScope', '$window', '$ionicLoading', '$ionicPopup', '$cordovaSQLite'];

    /* @ngInject */
    function runIonicStartUp ($ionicPlatform, $rootScope, $window, $ionicLoading, $ionicPopup, $cordovaSQLite) {
      $rootScope.db = null;

      $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        }
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }

        $rootScope.db = $cordovaSQLite.openDB({name: 'buysale.db', location: 'default'});
        $cordovaSQLite.execute($rootScope.db, "CREATE TABLE IF NOT EXISTS catalogueItems (id integer primary key, data text)");
      });
      $rootScope.show = function (text) {
        $rootScope.loading = $ionicLoading.show({
          template: text ? text : 'Loading...',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 500,
          showDelay: 0
        });
      };
      $rootScope.hide = function () {
        $ionicLoading.hide();
      };
    }

    config.$inject = ['$stateProvider'];

    /* @ngInject */
    function config ($stateProvider) {
      $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "app/core/menu.html",
        controller: 'CoreCtrl'
      });
    }

})();

