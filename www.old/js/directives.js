angular.module('starter.directives', [])


.directive('fancySelect', function($ionicModal) {
  var link = function(scope, element, attrs) {
    scope.$watch('product.myOptions', function(){
      if (typeof scope.product.myOptions !== 'undefined' && scope.product.myOptions[(scope.optionnumber-1)] !== 'undefined') {
        scope.myoption = scope.product.myOptions[(scope.optionnumber-1)];
      }
    });
    $ionicModal.fromTemplateUrl(
      'templates/partials/fancy-select-items.html',{
      'scope': scope
    }).then(function(modal) {
      scope.modal = modal;
    });
    scope.showItems = function (event) {
      event.preventDefault();
      scope.modal.show();
    }
    scope.hideItems = function () {
      scope.modal.hide();
    }
    scope.$on('$destroy', function() {
      scope.modal.remove();
    });
    scope.validateOption = function (option) {
      scope.myoption = option;
      scope.product.myOptions[(scope.optionnumber-1)] = option;
      scope.product.myPrice = scope.product.Price;
      scope.product.myOptions.forEach(function(option) {
        scope.product.myPrice = scope.product.myPrice + option.get("deltaPrice");
      });
      scope.hideItems();
    }
  };
  return {
    restrict : 'E',
    templateUrl: 'templates/partials/fancy-select.html',
    scope: {
      'product' : '=',
      'optionnumber' : '='
    },
    link: link
  };
})

.directive('ionCartFooter', function($state,$rootScope) {
  var link = function(scope, element, attr) {
    $rootScope.$watch('isLoggedIn', function(){
      if ($rootScope.isLoggedIn) {
        element.html("<div class='title cart-footer'>Checkout</div>");
      }
      else {
        element.html("<div class='title cart-footer'>Register / Checkout</div>");
      }
    }, true);
    element.addClass('bar bar-footer bar-positive');
    element.on('click', function(e){
      $state.go('app.checkout');
    });
    element.on('touchstart', function(){
      element.css({opacity: 0.8});
    });
    element.on('touchend', function(){
      element.css({opacity: 1});
    });
  };
  return {
    restrict: 'AEC',
    templateUrl: 'templates/partials/cart-footer.html',
    link: link
  };
})


.directive('input', function($timeout){
     return {
         restrict: 'E',
         scope: {
             'returnClose': '=',
             'onReturn': '&'
        },
        link: function(scope, element, attr){
            element.bind('keydown', function(e){
                if(e.which == 13){
                    if(scope.returnClose){
                        //console.log('return-close true: closing keyboard');
                        element[0].blur();
                    }
                    if(scope.onReturn){
                        $timeout(function(){
                            scope.onReturn();
                        });
                    }
                }
            });
        }
    }
});
