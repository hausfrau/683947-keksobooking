'use strict';

(function () {
  var MAP_PIN_MAIN_X_LIMITS = [0, 1135];
  var MAP_PIN_MAIN_Y_LIMITS = [150, 625];
  var TAIL_HEIGHT = 22;

  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var address = document.querySelector('#address');
  var mapPinMainStartLeft = mapPinMain.style.left;
  var mapPinMainStartTop = mapPinMain.style.top;
  var mapPinMainWidth = mapPinMain.querySelector('img').width;
  var mapPinMainHeight = mapPinMain.querySelector('img').height;
  var startCoords = {};
  var isPinsRendered = false;
  var mouseUp = false;

  var initAddress = function () {
    address.value = (parseInt(mapPinMain.style.left, 10) - mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) - mapPinMainHeight / 2);
    address.readOnly = true;
  };

  var updateAddress = function () {
    address.value = (parseInt(mapPinMain.style.left, 10) + mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) + mapPinMainHeight / 2 + TAIL_HEIGHT);
  };

  var clearPins = function () {
    var allmapPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (var i = 0; i < allmapPins.length; i++) {
      mapPins.removeChild(allmapPins[i]);
    }
    isPinsRendered = false;
  };

  var renderMapPins = function (parentElement, advertisementsArray) {
    if (!advertisementsArray.length) {
      return;
    }

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < advertisementsArray.length; i++) {
      var advertisement = advertisementsArray[i];
      fragment.appendChild(window.pin.createPin(advertisement, i));
    }

    parentElement.appendChild(fragment);
    isPinsRendered = true;
  };

  var enableMapAndForm = function (state) {
    var MAP_FADED = 'map--faded';
    var AD_FORM_DISABLED = 'ad-form--disabled';

    if (state) {
      map.classList.remove(MAP_FADED);
      adForm.classList.remove(AD_FORM_DISABLED);
    } else {
      map.classList.add(MAP_FADED);
      adForm.classList.add(AD_FORM_DISABLED);
    }
  };

  var resetMapPinMain = function () {
    mapPinMain.style.left = mapPinMainStartLeft;
    mapPinMain.style.top = mapPinMainStartTop;
  };

  var mouseMoveHandler = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var finalTop = (mapPinMain.offsetTop - shift.y);
    var finalLeft = (mapPinMain.offsetLeft - shift.x);

    if (finalTop < MAP_PIN_MAIN_Y_LIMITS[0]) {
      finalTop = MAP_PIN_MAIN_Y_LIMITS[0];
    } else if (finalTop > MAP_PIN_MAIN_Y_LIMITS[1]) {
      finalTop = MAP_PIN_MAIN_Y_LIMITS[1];
    }

    if (finalLeft < MAP_PIN_MAIN_X_LIMITS[0]) {
      finalLeft = MAP_PIN_MAIN_X_LIMITS[0];
    } else if (finalLeft > MAP_PIN_MAIN_X_LIMITS[1]) {
      finalLeft = MAP_PIN_MAIN_X_LIMITS[1];
    }

    mapPinMain.style.top = finalTop + 'px';
    mapPinMain.style.left = finalLeft + 'px';
    updateAddress();
  };

  var setActiveState = function (activeState) {
    enableMapAndForm(activeState);
    window.form.clearForm();
    window.form.toggleFieldsets(!activeState);

    if (!activeState) {
      clearPins();
      resetMapPinMain();
    }

    initAddress();
  };

  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault();
    setActiveState(true);
    if (!isPinsRendered) {
      renderMapPins(document.querySelector('.map__pins'), window.data.advertisements);
    }
    updateAddress();
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    mouseUp = true;
  };

  var mapPinsClickHandler = function (evt) {
    var element = evt.target;
    var index;

    while (!element.classList.contains('map__pin') && element.parentElement !== null) {
      element = element.parentElement;
    }

    index = element.dataset.index;

    window.card.toggleCardVisibility(false);

    if (isFinite(index)) {
      window.card.openCard(window.data.advertisements[index]);
    }
  };

  mapPins.addEventListener('click', mapPinsClickHandler);

  mapPins.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, mapPinsClickHandler);
  });

  var errorHandler = function (errorMessage) {
    window.util.showError(errorMessage, 10000);
  };

  var successHandler = function (response) {
    window.data.setData(response);

    if (mouseUp) {
      renderMapPins(document.querySelector('.map__pins'), window.data.advertisements);
      mouseUp = false;
    }
  };

  var mouseDownHandler = function (evt) {
    evt.preventDefault();

    enableMapAndForm(true);

    if (!window.data.isDataLoaded()) {
      window.backend.load(successHandler, errorHandler);
    }

    startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  window.map = {
    setActiveState: setActiveState
  };

  setActiveState(false);
  mapPinMain.draggable = true;
  mapPinMain.addEventListener('mousedown', mouseDownHandler);
})();
