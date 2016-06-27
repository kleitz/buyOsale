(function () {
  'use strict';

  angular
    .module('app.catalogue')
    .controller('CatalogueCtrl', CatalogueCtrl);

  CatalogueCtrl.$inject = ['$scope', 'dataService', '$ionicModal', '$ionicPopup', 'itemPriceUpdateModal', '$ionicPlatform', '$filter'];

  /* @ngInject */
  function CatalogueCtrl($scope, dataService, $ionicModal, $ionicPopup, itemPriceUpdateModal, $ionicPlatform, $filter) {
    var cs = this;


    /* vars */
    cs.catalogueItems = [];
    cs.catalogueItemsToView = []; // var for infinite scroll
    cs.shownItem = '';
    cs.itemAmountModalSum = '0';
    cs.itemAmountArbitraryAmount = '8';
    cs.arbitraryVarFlag = false;// flag for the arbitrary var change action
    cs.tmpShortCode = ''; // tmp var for the item amount change modal
    cs.tmpItem = {}; // tmp var for modal usage
    cs.filterList = [];
    cs.catalogueItemsInfinteScrollPtr = 20;
    cs.brandFilter = '';
    cs.mainGroupFilter = '';
    cs.subGroupFilter = '';
    cs.subSubGroupFilter = '';
    cs.minItemConsumerPrice = 1000000;
    cs.maxItemConsumerPrice = 0;
    cs.minItemMechironPrice = 1000000;
    cs.maxItemMechironPrice = 0;
    cs.itemConsumerPriceRange = 0;
    cs.itemMechironPriceRange = 0;
    cs.itemMechironPriceslider = {
      minValue: cs.minItemMechironPrice,
      maxValue: cs.maxItemMechironPrice,
      options: {
        floor: cs.minItemMechironPrice,
        ceil: cs.maxItemMechironPrice,
        step: 1
      }
    };
    cs.itemConsumerPriceslider = {
      minValue: cs.minItemConsumerPrice,
      maxValue: cs.maxItemConsumerPrice,
      options: {
        floor: cs.minItemConsumerPrice,
        ceil: cs.maxItemConsumerPrice,
        step: 0.1,
        precision: 1
      }
    };



    /* functions */
    cs.toggle = toggle;
    cs.isShown = isShown;
    cs.addToModalCalcSum = addToModalCalcSum; // add number (int)
    cs.resetModalCalcSum = resetModalCalcSum;
    cs.updateModalCalcSum = updateModalCalcSum; // add digit (string)
    cs.displayItemAmountModalSum = displayItemAmountModalSum;
    cs.changeArbitraryVar = changeArbitraryVar;
    cs.amountDisplay = amountDisplay;
    cs.updateItemAmount = updateItemAmount;
    cs.displayItemArbitraryAmount = displayItemArbitraryAmount;
    cs.openItemAmountModal = openItemAmountModal;
    cs.openItemCommentPopUp = openItemCommentPopUp;
    cs.openCatalogueFiltersModal = openCatalogueFiltersModal;
    cs.openFiltersModal = openFiltersModal;
    cs.filterCatalogueItems = filterCatalogueItems;
    cs.addFilterToFilterList = addFilterToFilterList;
    cs.removeFilterFromFilterList = removeFilterFromFilterList;
    cs.reFilterCatalogue = reFilterCatalogue;
    cs.reFilterCatalogueByPriceRanges = reFilterCatalogueByPriceRanges;
    cs.reFilterCatalogueByHangableItems = reFilterCatalogueByHangableItems;
    cs.getFilterIndex = getFilterIndex;
    cs.loadMore = loadMore; // infinite scroll
    cs.moreDataCanBeLoaded = moreDataCanBeLoaded; // infinite scroll
    cs.itemStockStatus = itemStockStatus; // check item stock status (if in stock or not)
    cs.calculateItemProfit = calculateItemProfit;
    cs.reStartModalCalcSum = reStartModalCalcSum;
    cs.getItemPrice = getItemPrice;
    cs.initializeInfiniteScroll = initializeInfiniteScroll;
    cs.getItemBrands = getItemBrands;
    cs.getItemMainGroups = getItemMainGroups;
    cs.getItemSubGroups = getItemSubGroups;
    cs.getItemSubSubGroups = getItemSubSubGroups;
    cs.getItemPriceRange = getItemPriceRange;
    cs.catalogueFiltersModalSubmit = catalogueFiltersModalSubmit;


    cs.ipus = itemPriceUpdateModal; // instantiate the service so we can use all of its functions and data in this scope
    cs.openItemPriceUpdateModal = openItemPriceUpdateModal; // MUST pass the $scope var to open the modal
    cs.closeItemPriceUpdateModal = closeItemPriceUpdateModal;


    /* controller init */
    activate();


    ////////////////////////////////


    function activate() {
      $ionicPlatform.ready(function () {
        dataService.getCatalogueItems().then(
          function (result) {
            cs.catalogueItems = result;
            cs.initializeInfiniteScroll();
          },
          function (error) {
            console.log('error');
          }
        );
      });
    }

    function toggle(item){
      if(cs.isShown(item)){
        cs.shownItem = null;
      }
      else{
        cs.shownItem = item;
      }
    }

    function isShown(item){
      return cs.shownItem === item;
    }

    $ionicModal.fromTemplateUrl('app/catalogue/itemAmountCalcModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function(){
      $scope.modal.remove();
    });

    function addToModalCalcSum(amount){
      cs.itemAmountModalSum = (parseInt(cs.itemAmountModalSum) + amount).toString();
    }

    function resetModalCalcSum(){
      if(!cs.arbitraryVarFlag)
        cs.itemAmountModalSum = '0';
      else
        cs.itemAmountArbitraryAmount = '0';
    }

    function updateModalCalcSum(digit){
      if(!cs.arbitraryVarFlag)
        cs.itemAmountModalSum += digit;
      else
        cs.itemAmountArbitraryAmount += digit;
    }

    function displayItemAmountModalSum(){
      return parseInt(cs.itemAmountModalSum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function changeArbitraryVar(){
      cs.arbitraryVarFlag = true;
    }

    function amountDisplay(amount){
      if(amount==0 || !amount)
        return '+';
      return amount;
    }

    function updateItemAmount(){
      if(!cs.arbitraryVarFlag) {
        for (var i = 0; i < cs.catalogueItems.length; i++) {
          if (cs.catalogueItems[i].shortCode == cs.tmpShortCode) {
            cs.catalogueItems[i].amount = parseInt(cs.itemAmountModalSum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            dataService.setCatalogueItemsLocal(cs.catalogueItems);
            $scope.closeModal();
            break;
          }
        }
      }
      else{
        cs.arbitraryVarFlag = false;
      }
    }

    function displayItemArbitraryAmount(){
      return parseInt(cs.itemAmountArbitraryAmount);
    }

    function openItemAmountModal(shortCode){
      cs.tmpShortCode = shortCode;
      $scope.modal.show();
    }

    function openItemCommentPopUp(comment){
      var alertPopup = $ionicPopup.alert({
        title: 'הודעה',
        template: '<div class="rtl text-center">'+comment+'</div>',
        okText: 'אישור',
        cssClass: 'item_comment_popup'
      });

      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
      });
    }

    function openCatalogueFiltersModal(){
      cs.openFiltersModal($scope).then(function(modal) {
        modal.show();
      });
    }

    function openItemPriceUpdateModal(item){
      cs.tmpItem = item;
      if(item.finalPrice !== undefined){
        itemPriceUpdateModal.setPrice(item.finalPrice);
      }
      else{
        itemPriceUpdateModal.setPrice(item.ma.mechir10);
      }

      itemPriceUpdateModal
        .openPriceModal($scope)
        .then(function(modal) {
          modal.show();
        });
    }

    function closeItemPriceUpdateModal(){
      if(cs.ipus.itemPriceDiscountEditActive){
        cs.ipus.itemPriceDiscountEditActive = false;

        cs.ipus.updatePriceWithDiscount();
      }
      else{
        for (var i = 0; i < cs.catalogueItems.length; i++) {
          if (cs.catalogueItems[i].shortCode == cs.tmpItem.shortCode) {
            cs.catalogueItems[i].finalPrice = parseInt(cs.ipus.getPrice()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            dataService.setCatalogueItemsLocal(cs.catalogueItems);
            $scope.closeModal();
            break;
          }
        }
        $scope.closeModal();
      }
    }

    function openFiltersModal($scope) {
      cs.getItemPriceRange();// initialize the price ranges for the first time
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
      if(cs.filterList.indexOf(filterName) !== -1){ // existing filter -> need to remove
        cs.removeFilterFromFilterList(filterName);
      }
      else { // new filter -> add to list
        cs.addFilterToFilterList(filterName);
        //console.log(se.filterList);
        cs.catalogueItems = $filter('orderBy')(cs.catalogueItems, filterName);
        cs.initializeInfiniteScroll(); // restart the infinite scrolling with the new filtered data.
      }
    }

    function addFilterToFilterList(filterName){
      cs.filterList.push(filterName);
    }

    function removeFilterFromFilterList(filterName){
      for(var i=0; i<cs.filterList.length; i++){
        if(cs.filterList[i] == filterName){
          cs.filterList.splice(i, 1);
          cs.reFilterCatalogue();
          break;
        }
      }
    }

    /**
     * filter the original catalogue by the filter list and update catalogue items var.
     */
    function reFilterCatalogue(){
      // reset the catalogue items
      cs.catalogueItems = dataService.getCatalogueItemsLocal();


      // process second region filters (selects)
      if(cs.brandFilter != undefined && cs.brandFilter != ''){
        var catalogue = []; // tmp var for processing
        for(var i=0; i<cs.catalogueItems.length; i++){
          if(cs.catalogueItems[i].maExt.brand == cs.brandFilter)
            catalogue.push(cs.catalogueItems[i]);
        }
        cs.catalogueItems = catalogue;
      }

      if(cs.mainGroupFilter != undefined && cs.mainGroupFilter != ''){
        var catalogue = []; // tmp var for processing
        for(var i=0; i<cs.catalogueItems.length; i++){
          if(cs.catalogueItems[i].mainGroup != null){
            if(cs.catalogueItems[i].mainGroup.groupName == cs.mainGroupFilter)
              catalogue.push(cs.catalogueItems[i]);
          }
        }
        cs.catalogueItems = catalogue;
      }

      if(cs.subGroupFilter != undefined && cs.subGroupFilter != ''){
        var catalogue = []; // tmp var for processing
        for(var i=0; i<cs.catalogueItems.length; i++){
          if(cs.catalogueItems[i].subGroup != null){
            if(cs.catalogueItems[i].subGroup.groupName == cs.subGroupFilter){
              catalogue.push(cs.catalogueItems[i]);
            }
          }
        }
        cs.catalogueItems = catalogue;
      }

      if(cs.subSubGroupFilter != undefined && cs.subSubGroupFilter != ''){
        var catalogue = []; // tmp var for processing
        for(var i=0; i<cs.catalogueItems.length; i++){
          if(cs.catalogueItems[i].subSubGroup != null){
            if(cs.catalogueItems[i].subSubGroup.groupName == cs.subSubGroupFilter)
              catalogue.push(cs.catalogueItems[i]);
          }
        }
        cs.catalogueItems = catalogue;
      }

      // sort by first region filters selected with their order
      for(var i=0; i<cs.filterList.length; i++){
        cs.catalogueItems = $filter('orderBy')(cs.catalogueItems, cs.filterList[i]);
      }


      // update price ranges by new catalogue items
      cs.getItemPriceRange();

      // restart the infinite scrolling with the new filtered data.
      cs.initializeInfiniteScroll();
    }

    function reFilterCatalogueByPriceRanges(){
      // process third part filters - prices ranges
      if(parseInt(cs.itemMechironPriceslider.minValue) != parseInt(cs.minItemMechironPrice)){
        var catalogue = []; // tmp var for processing
        for(var i=0; i<cs.catalogueItems.length; i++){
          if(cs.catalogueItems[i].ma.mechir10 >= cs.itemMechironPriceslider.minValue){
            catalogue.push(cs.catalogueItems[i]);
          }
        }
        cs.catalogueItems = catalogue;
      }

      if(parseInt(cs.itemMechironPriceslider.maxValue) != parseInt(cs.maxItemMechironPrice)){
        var catalogue = []; // tmp var for processing
        for(var i=0; i<cs.catalogueItems.length; i++){
          if(cs.catalogueItems[i].ma.mechir10 < cs.itemMechironPriceslider.maxValue){
            catalogue.push(cs.catalogueItems[i]);
          }
        }
        cs.catalogueItems = catalogue;
      }

      if(parseInt(cs.itemConsumerPriceslider.minValue) != parseInt(cs.minItemConsumerPrice)){
        var catalogue = []; // tmp var for processing
        for(var i=0; i<cs.catalogueItems.length; i++){
          if(cs.catalogueItems[i].ma.calc10 >= cs.itemConsumerPriceslider.minValue){
            catalogue.push(cs.catalogueItems[i]);
          }
        }
        cs.catalogueItems = catalogue;
      }

      if(parseInt(cs.itemConsumerPriceslider.maxValue) != parseInt(cs.maxItemConsumerPrice)){
        var catalogue = []; // tmp var for processing
        for(var i=0; i<cs.catalogueItems.length; i++) {
          if (cs.catalogueItems[i].ma.calc10 < cs.itemConsumerPriceslider.maxValue){
            catalogue.push(cs.catalogueItems[i]);
          }
        }
        cs.catalogueItems = catalogue;
      }
    }

    function reFilterCatalogueByHangableItems(){
      var catalogue = []; // tmp var for processing
      for(var i=0; i<cs.catalogueItems.length; i++) {
        if (cs.catalogueItems[i].products_icons.c6){
          catalogue.push(cs.catalogueItems[i]);
        }
      }
      cs.catalogueItems = catalogue;
    }

    function getFilterIndex(filterName){
      var i = cs.filterList.indexOf(filterName);
      if(i !== -1)
        return i+1;
      return i;
    }

    /**
     * Infinite scroll
     */
    function loadMore(){
      cs.tmp = cs.catalogueItems.slice(cs.catalogueItemsInfinteScrollPtr, cs.catalogueItemsInfinteScrollPtr+20);
      for(var i=0; i<cs.tmp.length; i++){
        cs.catalogueItemsToView.push(cs.tmp[i]);
      }
      cs.$broadcast('scroll.infiniteScrollComplete');
      cs.catalogueItemsInfinteScrollPtr += 20; // move to next 20 items in list
    }

    /**
     * Infinite scroll
     */
    function moreDataCanBeLoaded(){
      if(cs.catalogueItemsInfinteScrollPtr<cs.catalogueItems.length-20){
        return true;
      }
      return false
    }

    /**
     * Infinite scroll
     */
     function initializeInfiniteScroll(){
      cs.catalogueItemsToView = cs.catalogueItems.slice(0, 20);
      cs.catalogueItemsInfinteScrollPtr = 20; // restart the infinite scroll pointer.
      console.log('initializeInfiniteScroll');
      console.log(cs.catalogueItemsToView[0]);
     }

    function itemStockStatus(stock_amount){
      return stock_amount >= 100 ? true : false;
    }

    function calculateItemProfit(a, b){
      var vat = 17;
      return parseInt(parseInt((((a/(1+vat/100))-b)/(a/(1+vat/100)))*100));
    }

    function reStartModalCalcSum(){
      itemPriceUpdateModal.setPrice(item.ma.mechir10);
    }

    function getItemPrice(item){
      if(item.finalPrice !== undefined)
        return item.finalPrice;
      return item.ma.mechir10;
    }

    function getItemBrands(){
      var brands = [];
      for(var i=0; i<cs.catalogueItems.length; i++){
        if(cs.catalogueItems[i].maExt.brand != ''){
          if(brands.indexOf(cs.catalogueItems[i].maExt.brand) == -1){
            brands.push(cs.catalogueItems[i].maExt.brand);
          }
        }
      }
      return brands;
    }

    function getItemMainGroups(){
      var mainGroups = [];
      for(var i=0; i<cs.catalogueItems.length; i++){
        if(cs.catalogueItems[i].mainGroup != null){
          if(cs.catalogueItems[i].mainGroup.groupName != ''){
            if(mainGroups.indexOf(cs.catalogueItems[i].mainGroup.groupName) == -1){
              mainGroups.push(cs.catalogueItems[i].mainGroup.groupName);
            }
          }
        }
      }
      return mainGroups;
    }

    function getItemSubGroups(){
      var subGroups = [];
      for(var i=0; i<cs.catalogueItems.length; i++){
        if(cs.catalogueItems[i].subGroup != null){
          if(cs.catalogueItems[i].subGroup.groupName != ''){
            if(subGroups.indexOf(cs.catalogueItems[i].subGroup.groupName) == -1){
              subGroups.push(cs.catalogueItems[i].subGroup.groupName);
            }
          }
        }
      }
      return subGroups;
    }

    function getItemSubSubGroups(){
      var subSubGroups = [];
      for(var i=0; i<cs.catalogueItems.length; i++){
        if(cs.catalogueItems[i].subSubGroup != null){
          if(cs.catalogueItems[i].subSubGroup.groupName != ''){
            if(subSubGroups.indexOf(cs.catalogueItems[i].subSubGroup.groupName) == -1){
              subSubGroups.push(cs.catalogueItems[i].subSubGroup.groupName);
            }
          }
        }
      }
      return subSubGroups;
    }

    function getItemPriceRange(){
      // reset the prices
      cs.minItemConsumerPrice = 1000000;
      cs.maxItemConsumerPrice = 0;
      cs.minItemMechironPrice = 1000000;
      cs.maxItemMechironPrice = 0;

      for(var i=0; i<cs.catalogueItems.length; i++){
        if(cs.catalogueItems[i].ma.calc10 > cs.maxItemConsumerPrice){
          cs.maxItemConsumerPrice = cs.catalogueItems[i].ma.calc10;
        }
        if(cs.catalogueItems[i].ma.calc10 < cs.minItemConsumerPrice){
          cs.minItemConsumerPrice = cs.catalogueItems[i].ma.calc10;
        }
        if(cs.catalogueItems[i].ma.mechir10 > cs.maxItemMechironPrice){
          cs.maxItemMechironPrice = cs.catalogueItems[i].ma.mechir10;
        }
        if(cs.catalogueItems[i].ma.mechir10 < cs.minItemMechironPrice){
          cs.minItemMechironPrice = cs.catalogueItems[i].ma.mechir10;
        }
      }

      // fix unrealistic negative prices
      if(cs.minItemMechironPrice < 0){
        cs.minItemMechironPrice = 0;
      }

      if(cs.minItemConsumerPrice < 0){
        cs.minItemConsumerPrice = 0;
      }


      cs.itemConsumerPriceRange = cs.minItemConsumerPrice;
      cs.itemMechironPriceRange = cs.minItemMechironPrice;

      cs.itemMechironPriceslider = {
        minValue: cs.minItemMechironPrice,
        maxValue: cs.maxItemMechironPrice,
        options: {
          floor: cs.minItemMechironPrice,
          ceil: cs.maxItemMechironPrice,
          step: 0.1,
          precision: 1
        }
      };

      cs.itemConsumerPriceslider = {
        minValue: cs.minItemConsumerPrice,
        maxValue: cs.maxItemConsumerPrice,
        options: {
          floor: cs.minItemConsumerPrice,
          ceil: cs.maxItemConsumerPrice,
          step: 0.1,
          precision: 1
        }
      };
    }

    function catalogueFiltersModalSubmit(){
      reFilterCatalogueByPriceRanges();

      if(cs.hangableItems){
        reFilterCatalogueByHangableItems();
      }

      // restart the infinite scrolling with the new filtered data.
      cs.initializeInfiniteScroll();

      $scope.modal.hide()
    }
  }
})();
