(function () {
  'use strict';

  angular
    .module('app.login')
    .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['$ionicPopup', '$state', '$ionicLoading', 'dataService', '$ionicPlatform'];

  /* @ngInject */
  function LoginCtrl($ionicPopup, $state, $ionicLoading, dataService, $ionicPlatform) {
    var lc = this;
    lc.pageTitle = 'LoginController';
    lc.loginProcess = loginProcess;
    lc.loginData = {
      username: 'testuser',
      password: '123456x'
    };

    activate();


    ////////////////


    function activate(){
    }

    function loginProcess(){
      //console.log('login button pressed');
      $ionicLoading.show({template: '<ion-spinner></ion-spinner>'});

      $ionicPlatform.ready(function () {
        var authPromise = dataService.authenticate(lc.loginData.username, lc.loginData.password);
        authPromise.then(function(res) {
          dataService.setToken(res.data.token);

          var httpGetCatalogueItemsPromise = dataService.httpGetCatalogueItems(res.data.token);
          httpGetCatalogueItemsPromise.then(function(innerRes) {
            //dataService.setCatalogueItems(innerRes.data);
            //console.log('login process->get the catalogue items');
            //console.log(innerRes.data);
            dataService.setCatalogueItems(innerRes.data).then(function(result){
              console.log('set catalogue items function - login controller');
              $ionicLoading.hide();

              console.log('got the catalogue items -> go to catalogue - login controller');
              //console.log(result[0]);
              $state.go('app.catalogue', {}, {reload: true});
            });
          });
        },
        function(error) {
          $ionicLoading.hide();
          lc.loginData.username = lc.loginData.password = ''; // reset form fields data
          var alertPopup = $ionicPopup.alert({
            title: 'אימות נכשל!',
            template: 'אנא בדוק את הפרטים ונסה שנית!'
          });
        });
      });
    }
  }

})();
