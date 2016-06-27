(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('loadItemPictures', loadItemPictures);

  loadItemPictures.$inject = ['$animate'];

  /* @ngInject */
  function loadItemPictures($animate) {

    // Loads item pictures from server - checks how many are available (1-6 product pictures)
    // Usage:
    //  <div data-load-item-pictures shortCode="{{ item.shortCode }}"></div>

    var directive = {
      //bindToController: true,
      //controller: ItemsDisplayTypeCtrl,
      //controllerAs: 'vm',
      link: link,
      template: '<img src="" ng-click="nextPicture()"/>',
      restrict: 'AE',
      replace: 'true',
      scope: {'shortCode': '@'}
    };
    return directive;

    function link(scope, element, attrs) {
      scope.path = "img/demo/";
      scope.images = [
        {name: 'product_img_1.jpg', active: true},
        {name: 'product_img_2.jpg', active: false}
      ];

      //scope.shortCode = attrs.shortCode;
      activate();

      function activate(){
        attrs.$set('src', scope.path+scope.images[0].name);
      }

      scope.nextPicture = function(){
        for(var i=0; i<scope.images.length; i++){
          if (scope.images[i].active == true){
            scope.images[i].active = false;
            if(i+1 != scope.images.length) {
              scope.images[i+1].active = true;
              attrs.$set('src', scope.path+scope.images[i+1].name);
            }
            else{
              scope.images[0].active = true;
              attrs.$set('src', scope.path+scope.images[0].name);
            }
            break;
          }
        }
      }
    }
  }
})();

