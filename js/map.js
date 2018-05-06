'use strict';

(function () {
  var MAP_PIN_MAIN_X_LIMITS = [0, 1135];
  var MAP_PIN_MAIN_Y_LIMITS = [150, 500];
  var TAIL_HEIGHT = 22;
  var MAP_PIN_SELECTOR = 'map__pin';
  var PINS_SELECTOR = '.map__pin:not(.map__pin--main)';

  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapPinMainElement = document.querySelector('.map__pin--main');
  var adFormElement = document.querySelector('.ad-form');
  var addressElement = document.querySelector('#address');
  var mapPinMainStartLeft = mapPinMainElement.style.left;
  var mapPinMainStartTop = mapPinMainElement.style.top;
  var mapPinMainWidth = mapPinMainElement.querySelector('img').width;
  var mapPinMainHeight = mapPinMainElement.querySelector('img').height;
  var startCoords = {};
  var isPinsRendered = false;
  var mouseUp = false;

  var initAddress = function () {
    addressElement.value = (parseInt(mapPinMainElement.style.left, 10) - mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMainElement.style.top, 10) - mapPinMainHeight / 2);
    addressElement.readOnly = true;
  };

  var updateAddress = function () {
    addressElement.value = (parseInt(mapPinMainElement.style.left, 10) + mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMainElement.style.top, 10) + mapPinMainHeight / 2 + TAIL_HEIGHT);
  };

  var clearPins = function () {
    var pinElements = mapPinsElement.querySelectorAll(PINS_SELECTOR);

    Array.prototype.forEach.call(pinElements, function (item) {
      mapPinsElement.removeChild(item);
    });
  };

  var renderMapPins = function (advertisements) {
    if (!advertisements.length) {
      return;
    }

    var fragment = document.createDocumentFragment();

    advertisements.forEach(function (item) {
      fragment.appendChild(window.pin.create(item));
    });

    mapPinsElement.appendChild(fragment);
    isPinsRendered = true;
  };

  var enableMapAndForm = function (state) {
    var MAP_FADED = 'map--faded';
    var AD_FORM_DISABLED = 'ad-form--disabled';

    if (state) {
      mapElement.classList.remove(MAP_FADED);
      adFormElement.classList.remove(AD_FORM_DISABLED);
    } else {
      mapElement.classList.add(MAP_FADED);
      adFormElement.classList.add(AD_FORM_DISABLED);
    }
  };

  var resetMapPinMain = function () {
    mapPinMainElement.style.left = mapPinMainStartLeft;
    mapPinMainElement.style.top = mapPinMainStartTop;
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

    var finalTop = (mapPinMainElement.offsetTop - shift.y);
    var finalLeft = (mapPinMainElement.offsetLeft - shift.x);

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

    mapPinMainElement.style.top = finalTop + 'px';
    mapPinMainElement.style.left = finalLeft + 'px';

    updateAddress();
  };

  var setActiveState = function (activeState) {
    enableMapAndForm(activeState);
    window.form.clear();
    window.form.toggleFieldsets(!activeState);

    if (!activeState) {
      isPinsRendered = false;
      clearPins();
      resetMapPinMain();
      window.photos.unbindListeners();
    } else {
      window.photos.bindListeners();
    }

    initAddress();
  };

  var mouseUpHandler = function (upEvt) {
    upEvt.preventDefault();
    setActiveState(true);

    if (!isPinsRendered) {
      renderMapPins(window.data.advertisements.slice(0, window.filter.ADVERTISEMENT_COUNT));
      window.filter.toggle(false);
    }

    updateAddress();

    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);

    mouseUp = true;
  };

  var openCard = function (evt) {
    var element = evt.target;

    while (!element.classList.contains(MAP_PIN_SELECTOR) && element.parentElement !== null) {
      element = element.parentElement;
    }

    window.card.close();

    if (element.dataset.advertisement) {
      window.card.open(JSON.parse(element.dataset.advertisement));
    }
  };

  var mapPinsClickHandler = function (evt) {
    openCard(evt);
  };

  var mapPinsEnterKeydownHandler = function (evt) {
    window.util.isEnterEvent(evt, openCard);
  };

  mapPinsElement.addEventListener('click', mapPinsClickHandler);
  mapPinsElement.addEventListener('keydown', mapPinsEnterKeydownHandler);

  var errorHandler = function (errorMessage) {
    window.util.showError(errorMessage);
  };

  var successHandler = function (response) {
    window.data.set(response);

    if (mouseUp) {
      renderMapPins(window.data.advertisements.slice(0, window.filter.ADVERTISEMENT_COUNT));
      window.filter.toggle(false);
      mouseUp = false;
    }
  };

  var mouseDownHandler = function (evt) {
    evt.preventDefault();

    enableMapAndForm(true);

    if (!window.data.isLoaded() && !window.data.isDataLoading) {
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
    setActiveState: setActiveState,
    renderMapPins: renderMapPins,
    clearPins: clearPins
  };

  window.form.toggleFieldsets(true);
  window.filter.toggle(true);
  initAddress();
  mapPinMainElement.draggable = true;
  mapPinMainElement.addEventListener('mousedown', mouseDownHandler);
})();
