'use strict';

window.address = (function () {
  var TAIL_HEIGHT = 22;

  var addressEl = document.querySelector('#address');
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPinMainWidth = mapPinMain.querySelector('img').width;
  var mapPinMainHeight = mapPinMain.querySelector('img').height;

  return {
    initAddress: function () {
      addressEl.value = (parseInt(mapPinMain.style.left, 10) - mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) - mapPinMainHeight / 2);
      addressEl.readOnly = true;
    },
    updateAddress: function () {
      addressEl.value = (parseInt(mapPinMain.style.left, 10) + mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) + mapPinMainHeight / 2 + TAIL_HEIGHT);
    }
  };
})();
