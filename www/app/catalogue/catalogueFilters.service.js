(function () {
  'use strict';

  angular
    .module('app.catalogue')
    .service('catalogueFilters', catalogueFilters);

  catalogueFilters.$inject = ['$ionicModal', '$filter'];

  /* @ngInject */
  function catalogueFilters($ionicModal, $filter) {
    var se = this;

    /* vars */
    se.filterList = [];
    //se.catalogueItems = [];


    /* functions */
    se.openFiltersModal = openFiltersModal;
    se.filterCatalogueItems = filterCatalogueItems;
    se.addFilterToFilterList = addFilterToFilterList;
    se.removeFilterFromFilterList = removeFilterFromFilterList;
    se.reFilterCatalogue = reFilterCatalogue;
    se.getFilterIndex = getFilterIndex;



    ////////////////

    function openFiltersModal($scope) {
      var promise = $ionicModal.fromTemplateUrl('app/catalogue/catalogueFiltersModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        return modal;
      });

      return promise;
    }

    /**
     * Filter catalogue items list by new filter
     * @param filterName
     * @param catalogue - item list
     * @returns Filtered catalogue item list
     */
    function filterCatalogueItems(filterName){
      if(se.filterList.indexOf(filterName) !== -1){ // existing filter -> need to remove
        se.removeFilterFromFilterList(filterName);
      }
      else { // new filter -> add to list
        se.addFilterToFilterList(filterName);
        //console.log(se.filterList);
        dataService.catalogueItemsToView = $filter('orderBy')(dataService.catalogueItemsToView, filterName);
      }
    }

    function addFilterToFilterList(filterName){
      se.filterList.push(filterName);
    }

    function removeFilterFromFilterList(filterName){
      for(var i=0; i<se.filterList.length; i++){
        if(se.filterList[i] == filterName){
          se.filterList.splice(i, 1);
          se.reFilterCatalogue();
          break;
        }
      }
    }

    function reFilterCatalogue(){
      // filter the original catalogue by the filter list and update catalogue items var.

      // reset the catalogue items
      if(dataService.getCatalogueItemsLocal() != '' ) { // the data is in local var and OK so procceed ahead
        dataService.catalogueItemsToView = dataService.catalogueItemsLocal;
        for(var i=0; i<se.filterList.length; i++){
          dataService.catalogueItemsToView = $filter('orderBy')(dataService.catalogueItemsToView, se.filterList[i]);
        }
      }
      else{ // no data in local var and need to go to SQL source
        dataService.getCatalogueItems().then(
          function(result){
            dataService.catalogueItemsToView = dataService.catalogueItemsLocal;
            for(var i=0; i<se.filterList.length; i++){
              dataService.catalogueItemsToView = $filter('orderBy')(dataService.catalogueItemsToView, se.filterList[i]);
            }
          },
          function(error){
            console.log('error');
          }
        );
      }
    }

    function getFilterIndex(filterName){
      var i = se.filterList.indexOf(filterName);
      if(i !== -1)
        return i+1;
      return i;
    }
  }

})();

