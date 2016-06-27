(function () {
  'use strict';

  angular
    .module('app.catalogue')
    .config(config)

    config.$inject = ['$stateProvider'];

    /* @ngInject */
    function config ($stateProvider) {
      $stateProvider
      .state('app.catalogue', {
        url: "/catalogue",
        views: {
          'menuContent' :{
            templateUrl: "app/catalogue/catalogue.html",
            controller: 'CatalogueCtrl as cs'
          }
        }
      });
    }

})();

