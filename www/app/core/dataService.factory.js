(function () {
  'use strict';

  angular
    .module('app.core')
    .factory('dataService', dataService);

  dataService.$inject = ['$http', '$window', '$cordovaSQLite', '$rootScope', '$q', '$state'];

  /* @ngInject */
  function dataService($http, $window, $cordovaSQLite, $rootScope, $q, $state) {
    var catalogueItemsLocal = []; // hold the original catalogue data

    var service = {
      getToken: getToken,
      setToken: setToken,
      getCatalogueItems: getCatalogueItems,
      setCatalogueItems: setCatalogueItems,
      getCatalogueItemsLocal: getCatalogueItemsLocal,
      setCatalogueItemsLocal: setCatalogueItemsLocal,
      authenticate: authenticate,
      httpGetCatalogueItems: httpGetCatalogueItems
    };
    return service;



    ////////////////



    function getToken(){
      var catalogueItems = angular.fromJson($window.localStorage.getItem('buyOsale_token'));
      return catalogueItems;
    }

    function setToken(t){
      $window.localStorage.setItem('buyOsale_token', angular.toJson(t));
    }

    function getCatalogueItems(){
      console.log('get catalogue items function - dataService');
      var deferred = $q.defer();

      if(catalogueItemsLocal == '') {
        var query = "SELECT * FROM catalogueItems";
        $cordovaSQLite.execute($rootScope.db, query, '').then(function (res) {
          if (res.rows.length > 0) {
            //console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
            console.log('SELECTED -> got the data from the db - dataService');
            //console.log(angular.fromJson(res.rows.item(0).data)[0]);
            catalogueItemsLocal = angular.fromJson(res.rows.item(0).data);
            deferred.resolve(angular.fromJson(res.rows.item(0).data));
          } else {
            console.log("No results found - dataService");

            // delete token and cause a new login sequence
            setToken('');
            $state.go('login');
          }
        }, function (err) {
          //console.log('error?');
          deferred.reject('problem!');
        });
      }
      else{
        console.log('catalogueItemsLocal - dataService');
        //console.log(catalogueItemsLocal);
        deferred.resolve(catalogueItemsLocal);
      }
      return deferred.promise;
    }

    function setCatalogueItems(t){
      var deferred = $q.defer();
      //console.log('starting queries');

      var query = "DELETE FROM catalogueItems";
      $cordovaSQLite.execute($rootScope.db, query, '').then(function(result) {
        //console.log('truncated table');
        var query2 = "INSERT INTO catalogueItems (data) VALUES (?)";
        //console.log(t);
        $cordovaSQLite.execute($rootScope.db, query2, [angular.toJson(t)]).then(function(result) {
          //console.log('inserted table data');
          deferred.resolve('all set');
        }, function (err) {
          //console.error(err);
          deferred.reject('problem!');
        });
      })

      return deferred.promise;
    }

    function authenticate(username, password){
      return $http.post('http://54.93.165.201/api/Auth/Login?user='+username+'&password='+password,{
        'headers' : {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    }

    function httpGetCatalogueItems(token) {
      return $http.get('http://54.93.165.201/api/Product',{
        'headers' : {
          'Content-Type': 'application/json; charset=utf-8',
          'token': token
        }
      });
    }

    function getCatalogueItemsLocal(){
      return catalogueItemsLocal;
    }

    function setCatalogueItemsLocal(data){
      catalogueItemsLocal = data;
    }
  }
})();

