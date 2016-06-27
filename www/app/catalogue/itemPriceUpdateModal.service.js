(function () {
  'use strict';

  angular
    .module('app.catalogue')
    .service('itemPriceUpdateModal', itemPriceUpdateModal);

  itemPriceUpdateModal.$inject = ['$ionicModal'];

  /* @ngInject */
  function itemPriceUpdateModal($ionicModal) {
    var se = this;

    /* vars */
    se.price = '0';
    se.discountPercent = '0';
    se.itemPriceDiscountEditActive = false;


    /* functions */
    se.openPriceModal = openPriceModal;
    se.getPrice = getPrice;
    se.setPrice = setPrice;
    se.updatePrice = updatePrice;
    se.toggleDiscountPercentEditMode = toggleDiscountPercentEditMode;
    se.displayItemDiscountPercent = displayItemDiscountPercent;
    se.displayCalcSum = displayCalcSum;
    se.getDiscountPercent = getDiscountPercent;
    se.resetModalCalcSum = resetModalCalcSum;
    se.updatePriceWithDiscount = updatePriceWithDiscount;
    se.formatDecimalNumber = formatDecimalNumber;


    ////////////////

    function openPriceModal($scope) {
      var promise = $ionicModal.fromTemplateUrl('app/catalogue/itemPriceUpdateModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        return modal;
      });

      return promise;
    }

    function getPrice(){
      return se.price;
    }

    function setPrice(price){
      se.price = price;
    }

    function updatePrice(digit){
      //console.log('price update '+digit);
      if(se.itemPriceDiscountEditActive){
        se.discountPercent += digit;
      }
      else{
        se.price += digit;
        //console.log(se.price);
      }
    }

    function toggleDiscountPercentEditMode(){
      se.itemPriceDiscountEditActive = !se.itemPriceDiscountEditActive;
      if(!se.itemPriceDiscountEditActive)
        se.updatePriceWithDiscount();
    }

    function displayItemDiscountPercent(){
      if(se.discountPercent == '0')
        return '%';
      return parseInt(getDiscountPercent()).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function displayCalcSum(){
      if(se.itemPriceDiscountEditActive){
        return formatDecimalNumber(getDiscountPercent());
      }
      return formatDecimalNumber(getPrice());
    }

    function getDiscountPercent(){
      return se.discountPercent;
    }


    function resetModalCalcSum(){
      if(se.itemPriceDiscountEditActive){
        se.discountPercent = '0';
      }
      else{
        setPrice('0');
      }
    }

    function updatePriceWithDiscount(){
      setPrice( ( parseInt(getPrice()) - (parseInt(getPrice()) * parseInt(getDiscountPercent() )/100)).toString() );
    }

    function formatDecimalNumber(n){
      var number = n.toString();
      if(number.indexOf('.') > -1) {
        var values = number.split('.');
        return parseInt(values[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + values[1];
      }
      else
        return parseInt(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

  }

})();

