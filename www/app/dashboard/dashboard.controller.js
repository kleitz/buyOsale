(function () {
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashBoardCtrl', DashBoardCtrl);

  DashBoardCtrl.$inject = [];

  /* @ngInject */
  function DashBoardCtrl() {
    var vm = this;
    vm.title = 'DashBoard';


    activate();

    ////////////////

    function activate() {

    }
  }

})();
