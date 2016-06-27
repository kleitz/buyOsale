(function() {
  'use strict';

  angular
    .module('app', [

      // todo - exception handling


      // ionic
      'ionic',
      'ngIOS9UIWebViewPatch',
      'ngCordova',


      // vendor
      'rzModule',


      //modules
      'app.core',
      'app.widgets',


      // Feature areas
      'app.login',
      'app.catalogue',
      'app.dashboard'
    ]);

})();

