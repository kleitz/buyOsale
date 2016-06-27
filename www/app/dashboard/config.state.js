(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .config(config)

    config.$inject = ['$stateProvider'];

    /* @ngInject */
    function config ($stateProvider) {
      $stateProvider
      .state('app.dashboard', {
        url: "/dashboard",
        views: {
          'menuContent' :{
            templateUrl: "app/dashboard/dashboard.html",
            controller: 'DashBoardCtrl as ds'
          }
        }
      });
    }

})();

