'use strict';

(function () {
  var HOUSING_TYPE = 'housing-type';
  var HOUSING_PRICE = 'housing-price';
  var HOUSING_ROOMS = 'housing-rooms';
  var HOUSING_GUESTS = 'housing-guests';
  var FILTER_WIFI = 'filter-wifi';
  var FILTER_DISHWASHER = 'filter-dishwasher';
  var FILTER_PARKING = 'filter-parking';
  var FILTER_WASHER = 'filter-washer';
  var FILTER_ELEVATOR = 'filter-elevator';
  var FILTER_CONDITIONER = 'filter-conditioner';
  var MAP_FILTER = 'map__filter';
  var MAP_CHECKBOX = 'map__checkbox';
  var ADVERTISEMENT_COUNT = 5;
  var ANY = 'any';
  var MIDDLE = 'middle';
  var LOW = 'low';
  var HIGH = 'high';
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var mapFiltersElement = document.querySelector('.map__filters');
  var housingTypeElement = mapFiltersElement.querySelector('#housing-type');
  var housingPriceElement = mapFiltersElement.querySelector('#housing-price');
  var housingRoomsElement = mapFiltersElement.querySelector('#housing-rooms');
  var housingGuestsElement = mapFiltersElement.querySelector('#housing-guests');
  var featuresElement = mapFiltersElement.querySelector('.map__features');
  var filterWifiElement = featuresElement.querySelector('#filter-wifi');
  var filterDishwasherElement = featuresElement.querySelector('#filter-dishwasher');
  var filterParkingElement = featuresElement.querySelector('#filter-parking');
  var filterWasherElement = featuresElement.querySelector('#filter-washer');
  var filterElevatorElement = featuresElement.querySelector('#filter-elevator');
  var filterConditionerElement = featuresElement.querySelector('#filter-conditioner');

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

  var resetSelectedOptions = function () {
    selectedOptions['housing-type'] = 'any';
    selectedOptions['housing-price'] = 'any';
    selectedOptions['housing-rooms'] = 'any';
    selectedOptions['housing-guests'] = 'any';
    selectedOptions['filter-wifi'] = false;
    selectedOptions['filter-dishwasher'] = false;
    selectedOptions['filter-parking'] = false;
    selectedOptions['filter-washer'] = false;
    selectedOptions['filter-elevator'] = false;
    selectedOptions['filter-conditioner'] = false;
  };

  var reset = function () {
    window.filter.isUnFiltered = true;
    housingTypeElement.value = 'any';
    housingPriceElement.value = 'any';
    housingRoomsElement.value = 'any';
    housingGuestsElement.value = 'any';
    filterWifiElement.checked = false;
    filterDishwasherElement.checked = false;
    filterParkingElement.checked = false;
    filterWasherElement.checked = false;
    filterElevatorElement.checked = false;
    filterConditionerElement.checked = false;
    resetSelectedOptions();
  };

  var isPriceSatisfies = function (advertisementPrice, selectedPrice) {
    var satisfaction = false;
    switch (selectedPrice) {
      case ANY:
        satisfaction = true;
        break;
      case MIDDLE:
        satisfaction = advertisementPrice >= LOW_PRICE && advertisementPrice <= HIGH_PRICE;
        break;
      case LOW:
        satisfaction = advertisementPrice <= LOW_PRICE;
        break;
      case HIGH:
        satisfaction = advertisementPrice >= HIGH_PRICE;
        break;
    }

    return satisfaction;
  };

  var checkFilterCheckbox = function (el, feature) {
    return !selectedOptions[feature] ||
      (selectedOptions[feature] &&
        el.offer.features &&
        el.offer.features.indexOf(featuresClassListMap[feature]) !== -1);
  };

  var checkFilterSelect = function (el, feature, featureValue, isNumber) {
    return featureValue === ANY || el.offer[feature] === (isNumber ? +featureValue : featureValue);
  };

  var filterAdvertisments = function (element) {
    return checkFilterSelect(element, 'type', selectedOptions[HOUSING_TYPE], false) &&
      isPriceSatisfies(element.offer.price, selectedOptions[HOUSING_PRICE]) &&
      checkFilterSelect(element, 'rooms', selectedOptions[HOUSING_ROOMS], true) &&
      checkFilterSelect(element, 'guests', selectedOptions[HOUSING_GUESTS], true) &&
      checkFilterCheckbox(element, FILTER_WIFI) &&
      checkFilterCheckbox(element, FILTER_DISHWASHER) &&
      checkFilterCheckbox(element, FILTER_PARKING) &&
      checkFilterCheckbox(element, FILTER_WASHER) &&
      checkFilterCheckbox(element, FILTER_ELEVATOR) &&
      checkFilterCheckbox(element, FILTER_CONDITIONER);
  };

  var updateAdvertisements = function () {
    window.map.clearPins();
    window.map.renderMapPins(window.data.advertisements.filter(filterAdvertisments).slice(0, ADVERTISEMENT_COUNT));
  };

  var mapFiltersChangeHandler = function (evt) {
    window.card.toggleCardVisibility(false);

    var element = evt.target;

    var value = null;

    while (!element.classList.contains(MAP_FILTER) && !element.classList.contains(MAP_CHECKBOX) && element.parentElement) {
      element = element.parentElement;
    }

    if (element.value) {
      value = element.type === 'checkbox' ? element.checked : element.value;
      selectedOptions[element.id] = value;

      window.util.debounce(updateAdvertisements);
    }
  };

  var toggle = function (flag) {
    var mapFilterElements = document.querySelectorAll('.' + MAP_FILTER);
    var mapCheckboxElements = document.querySelectorAll('.' + MAP_CHECKBOX);

    Array.prototype.forEach.call(mapFilterElements, function (item) {
      item.disabled = flag;
    });

    Array.prototype.forEach.call(mapCheckboxElements, function (item) {
      item.disabled = flag;
    });
  };

  window.filter = {
    ADVERTISEMENT_COUNT: ADVERTISEMENT_COUNT,
    toggle: toggle,
    reset: reset
  };

  mapFiltersElement.addEventListener('change', mapFiltersChangeHandler);
})();
