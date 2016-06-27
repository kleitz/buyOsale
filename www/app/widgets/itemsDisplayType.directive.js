(function () {
  'use strict';

  angular
    .module('app.widgets')
    .directive('itemsDisplayType', itemsDisplayType);

  itemsDisplayType.$inject = [];

  /* @ngInject */
  function itemsDisplayType() {

    // Changes the type display type of the items in the catalogue.
    // Usage:
    //  <div data-items-display-type></div>

    var directive = {
      //bindToController: true,
      //controller: ItemsDisplayTypeCtrl,
      //controllerAs: 'vm',
      link: link,
      templateUrl: 'app/widgets/itemsDisplayType.html',
      restrict: 'A',
      scope: {}
    };
    return directive;

    function link(scope, element, attrs) {
      scope.displayModes = [
        {name:'display_big_pictures', value: true},
        {name:'display_small_pictures', value: false},
        {name:'display_text', value: false}
      ];

      scope.displayMode = function(mode) {
        return scope.displayModes[mode].value;
      };

      scope.changeDisplayMode = function(){
        for(var i=0; i<scope.displayModes.length; i++){
          if(scope.displayModes[i].value == true){
            scope.displayModes[i].value = false;

            angular.element(document.querySelectorAll('.cat_item_container')).removeClass(scope.displayModes[i].name);
            //angular.element(document.querySelectorAll('.item_details_container')).removeClass(scope.displayModes[i].name);

            if(i+1 != scope.displayModes.length){
              scope.displayModes[i+1].value = true;

              angular.element(document.querySelectorAll('.cat_item_container')).addClass(scope.displayModes[i+1].name);
              //angular.element(document.querySelectorAll('.item_details_container')).addClass(scope.displayModes[i+1].name);

            }
            else{
              scope.displayModes[0].value = true;

              angular.element(document.querySelectorAll('.cat_item_container')).addClass(scope.displayModes[0].name);
              //angular.element(document.querySelectorAll('.item_details_container')).addClass(scope.displayModes[0].name);
            }

            break;
          }
        }
      };
    }
  }
})();

