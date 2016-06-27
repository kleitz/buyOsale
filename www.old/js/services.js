angular.module('starter.services', [])

.factory('Search', function() {
  return {query: ""}
})

.service('AuthService', function($q, $http, $window) {
  var LOCAL_TOKEN_KEY = 'buyOsale_auth_token';
  var username = ''; // phone number
  var supplierName = ''; // name
  var userType = ''; // type
  var business_id = ''; // business_id
  var role = ''; // admin or user
  var authToken;

  function loadUserCredentials() {
    var token = $window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    $window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    username = token.split('.')[0];
    role = token.split('.')[1];
    isAuthenticated = true;
    authToken = token;

  }

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    supplierName = '';
    userType = '';
    business_id = '';
    role = '';
    isAuthenticated = false;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var login = function(name, pw) {
    return $q(function(resolve, reject) {
      var loginApplicationUserPromise = DataServiceHTTP.loginApplicationUser(name, pw);
      loginApplicationUserPromise.then(function(response) {
        if(response.data.status == 'true'){
          storeUserCredentials(response.data.phone_number + '.' + response.data.role + '.yourServerToken');
          resolve('Login success.');
        }
        else{
          reject('Login Failed.');
        }
      });
    });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  var checkCredentials = function() {
    loadUserCredentials();
    console.log('checkCredentials '+ isAuthenticated);
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;}, // phone number
    role: function() {return role;},
    business_id: function() {return business_id;},
    userType: function() {return userType;},
    supplierName: function() {return supplierName;}
  };
})

;
