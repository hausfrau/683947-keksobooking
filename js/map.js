'use strict';

(function () {
  var MAP_PIN_MAIN_X_LIMITS = [0, 1135];
  var MAP_PIN_MAIN_Y_LIMITS = [150, 625];
  var TAIL_HEIGHT = 22;
  var REFRESH_TIME = 500;
  var ADVERTISEMENT_COUNT = 5;
  var HOUSING_TYPE = 'housing-type';
  var HOUSING_PRICE = 'housing-price';
  var HOUSING_ROOMS = 'housing-rooms';
  var HOISING_GUESTS = 'housing-guests';
  var FILTER_WIFI = 'filter-wifi';
  var FILTER_DISHWASHER = 'filter-dishwasher';
  var FILTER_PARKING = 'filter-parking';
  var FILTER_WASHER = 'filter-washer';
  var FILTER_ELEVATOR = 'filter-elevator';
  var FILTER_CONDITIONER = 'filter-conditioner';
  var MAP_PIN = 'map__pin';
  var MAP_FILTER = 'map__filter';
  var MAP_CHECKBOX = 'map__checkbox';
  var MAP_PIN_NOT_MAIN = '.map__pin:not(.map__pin--main)';

  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var adForm = document.querySelector('.ad-form');
  var address = document.querySelector('#address');
  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var features = mapFilters.querySelector('.map__features');
  var filterWifi = features.querySelector('#filter-wifi');
  var filterDishwasher = features.querySelector('#filter-dishwasher');
  var filterParking = features.querySelector('#filter-parking');
  var filterWasher = features.querySelector('#filter-washer');
  var filterElevator = features.querySelector('#filter-elevator');
  var filterConditioner = features.querySelector('#filter-conditioner');
  var mapPinMainStartLeft = mapPinMain.style.left;
  var mapPinMainStartTop = mapPinMain.style.top;
  var mapPinMainWidth = mapPinMain.querySelector('img').width;
  var mapPinMainHeight = mapPinMain.querySelector('img').height;
  var startCoords = {};
  var isPinsRendered = false;
  var mouseUp = false;
  var isUnFiltered = true;

  var featuresClassListMap = {
    'filter-wifi': 'wifi',
    'filter-dishwasher': 'dishwasher',
    'filter-parking': 'parking',
    'filter-washer': 'washer',
    'filter-elevator': 'elevator',
    'filter-conditioner': 'conditioner'
  };

  var selectedOptions = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any',
    'filter-wifi': false,
    'filter-dishwasher': false,
    'filter-parking': false,
    'filter-washer': false,
    'filter-elevator': false,
    'filter-conditioner': false
  };

  var checkForUnfiltered = function () {
    isUnFiltered = false;
    if (housingType.value === 'any' &&
      housingPrice.value === 'any' &&
      housingRooms.value === 'any' &&
      housingGuests.value === 'any' &&
      !filterWifi.checked &&
      !filterDishwasher.checked &&
      !filterParking.checked &&
      !filterWasher.checked &&
      !filterElevator.checked &&
      !filterConditioner.checked) {
      isUnFiltered = true;
    }
  };

  var sortAdvertisementsByPrice = function () {
    return window.data.advertisements.slice().sort(function (one, two) {
      var priceDifference = one.offer.price - two.offer.price;
      if (priceDifference === 0) {
        priceDifference = window.data.advertisements.indexOf(two) - window.data.advertisements.indexOf(one);
      }
      return priceDifference;
    });
  };

  var isPriceSatisfies = function (advertisementPrice, selectedPrice) {
    var satisfaction = false;
    switch (selectedPrice) {
      case 'any':
        satisfaction = true;
        break;
      case 'middle':
        satisfaction = advertisementPrice >= 10000 && advertisementPrice <= 50000;
        break;
      case 'low':
        satisfaction = advertisementPrice <= 10000;
        break;
      case 'high':
        satisfaction = advertisementPrice >= 50000;
        break;
    }
    return satisfaction;
  };

  var getPonderability = function (advertisement) {
    var ponderability = 0;

    var houseType = selectedOptions[HOUSING_TYPE];
    if (houseType === 'any' || advertisement.offer.type === houseType) {
      ponderability += 25;
    }

    if (isPriceSatisfies(advertisement.offer.price, selectedOptions[HOUSING_PRICE])) {
      ponderability += 30;
    }

    var houseRooms = selectedOptions[HOUSING_ROOMS];
    if (houseRooms === 'any' || advertisement.offer.rooms === +houseRooms) {
      ponderability += 7;
    }

    var houseGuests = selectedOptions[HOISING_GUESTS];
    if (houseGuests === 'any' || advertisement.offer.guests === +houseGuests) {
      ponderability += 7;
    }
    if (advertisement.offer.features) {
      if (selectedOptions[FILTER_WIFI] && advertisement.offer.features.indexOf(featuresClassListMap[FILTER_WIFI]) !== -1) {
        ponderability += 1;
      }

      if (selectedOptions[FILTER_DISHWASHER] && advertisement.offer.features.indexOf(featuresClassListMap[FILTER_DISHWASHER]) !== -1) {
        ponderability += 1;
      }

      if (selectedOptions[FILTER_PARKING] && advertisement.offer.features.indexOf(featuresClassListMap[FILTER_PARKING]) !== -1) {
        ponderability += 1;
      }

      if (selectedOptions[FILTER_WASHER] && advertisement.offer.features.indexOf(featuresClassListMap[FILTER_WASHER]) !== -1) {
        ponderability += 1;
      }

      if (selectedOptions[FILTER_ELEVATOR] && advertisement.offer.features.indexOf(featuresClassListMap[FILTER_ELEVATOR]) !== -1) {
        ponderability += 1;
      }

      if (selectedOptions[FILTER_CONDITIONER] && advertisement.offer.features.indexOf(featuresClassListMap[FILTER_CONDITIONER]) !== -1) {
        ponderability += 1;
      }
    }

    return ponderability;
  };

  var updateAdvertisements = function () {
    clearPins();
    window.data.filteredAdvertisements = sortAdvertisementsByPrice().sort(function (one, two) {
      var ponderabilityDifference = getPonderability(two) - getPonderability(one);
      if (ponderabilityDifference === 0) {
        ponderabilityDifference = one.offer.price - two.offer.price;
      }
      return ponderabilityDifference;
    }).slice(0, ADVERTISEMENT_COUNT);
    renderMapPins(mapPins, window.data.filteredAdvertisements);
  };

  var getFilteredValues = function (evt) {
    window.card.toggleCardVisibility(false);
    var element = evt.target;
    var value = null;
    while (!element.classList.contains(MAP_FILTER) && !element.classList.contains(MAP_CHECKBOX) && element.parentElement !== null) {
      element = element.parentElement;
    }

    if (element.value) {
      switch (element.type) {
        case 'checkbox':
          value = element.checked;
          break;
        default:
          value = element.value;
          break;
      }

      selectedOptions[element.id] = value;

      checkForUnfiltered();

      if (isUnFiltered) {
        clearPins();
        renderMapPins(mapPins, window.data.advertisements.slice(0, ADVERTISEMENT_COUNT));
      } else {
        window.setTimeout(function () {
          updateAdvertisements();
        }, REFRESH_TIME);
      }
    }
  };

  mapFilters.addEventListener('change', getFilteredValues);

  var initAddress = function () {
    address.value = (parseInt(mapPinMain.style.left, 10) - mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) - mapPinMainHeight / 2);
    address.readOnly = true;
  };

  var updateAddress = function () {
    address.value = (parseInt(mapPinMain.style.left, 10) + mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) + mapPinMainHeight / 2 + TAIL_HEIGHT);
  };

  var clearPins = function () {
    var allmapPins = mapPins.querySelectorAll(MAP_PIN_NOT_MAIN);

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
      if (isUnFiltered) {
        renderMapPins(mapPins, window.data.advertisements.slice(0, ADVERTISEMENT_COUNT));
      } else {
        renderMapPins(mapPins, window.data.filteredAdvertisements.slice(0, ADVERTISEMENT_COUNT));
      }
    }
    updateAddress();
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
    mouseUp = true;
  };

  var mapPinsClickHandler = function (evt) {
    var element = evt.target;
    var index;

    while (!element.classList.contains(MAP_PIN) && element.parentElement !== null) {
      element = element.parentElement;
    }

    index = element.dataset.index;

    window.card.toggleCardVisibility(false);

    if (isFinite(index)) {
      if (isUnFiltered) {
        window.card.openCard(window.data.advertisements[index]);
      } else {
        window.card.openCard(window.data.filteredAdvertisements[index]);
      }
    }
  };

  mapPins.addEventListener('click', mapPinsClickHandler);

  mapPins.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, mapPinsClickHandler);
  });

  var errorHandler = function (errorMessage) {
    window.util.showError(errorMessage);
  };

  var successHandler = function (response) {
    window.data.setData(response);

    if (mouseUp) {
      renderMapPins(mapPins, window.data.advertisements.slice(0, ADVERTISEMENT_COUNT));
      mouseUp = false;
    }
  };

  var mouseDownHandler = function (evt) {
    evt.preventDefault();

    enableMapAndForm(true);

    if (!window.data.isDataLoaded() && !window.data.isDataLoading) {
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
