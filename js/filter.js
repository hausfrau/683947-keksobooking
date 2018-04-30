'use strict';

(function () {
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
  var MAP_FILTER = 'map__filter';
  var MAP_CHECKBOX = 'map__checkbox';
  var ADVERTISEMENT_COUNT = 5;

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

  var resetFilter = function () {
    window.filter.isUnFiltered = true;
    housingType.value = 'any';
    housingPrice.value = 'any';
    housingRooms.value = 'any';
    housingGuests.value = 'any';
    filterWifi.checked = false;
    filterDishwasher.checked = false;
    filterParking.checked = false;
    filterWasher.checked = false;
    filterElevator.checked = false;
    filterConditioner.checked = false;
    resetSelectedOptions();
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

  var checkFilterCheckbox = function (el, feature) {
    return !selectedOptions[feature] ||
      (selectedOptions[feature] &&
        el.offer.features &&
        el.offer.features.indexOf(featuresClassListMap[feature]) !== -1);
  };

  var checkFilterSelect = function (el, feature, featureValue, isNumber) {
    return featureValue === 'any' || el.offer[feature] === (isNumber ? +featureValue : featureValue);
  };

  var filterAdvertisments = function (element) {
    var houseTypeSuitable = checkFilterSelect(element, 'type', selectedOptions[HOUSING_TYPE], false);

    var housePriceSuitable = isPriceSatisfies(element.offer.price, selectedOptions[HOUSING_PRICE]);

    var houseRoomsSuitable = checkFilterSelect(element, 'rooms', selectedOptions[HOUSING_ROOMS], true);

    var houseGuestsSuitable = checkFilterSelect(element, 'guests', selectedOptions[HOISING_GUESTS], true);

    var filterWifiSuitable = checkFilterCheckbox(element, FILTER_WIFI);

    var filterDishwasherSuitable = checkFilterCheckbox(element, FILTER_DISHWASHER);

    var filterParkingSuitable = checkFilterCheckbox(element, FILTER_PARKING);

    var filterWasherSuitable = checkFilterCheckbox(element, FILTER_WASHER);

    var filterElevatorSuitable = checkFilterCheckbox(element, FILTER_ELEVATOR);

    var filterConditionerSuitable = checkFilterCheckbox(element, FILTER_CONDITIONER);

    return houseTypeSuitable &&
      housePriceSuitable &&
      houseRoomsSuitable &&
      houseGuestsSuitable &&
      filterWifiSuitable &&
      filterDishwasherSuitable &&
      filterParkingSuitable &&
      filterWasherSuitable &&
      filterElevatorSuitable &&
      filterConditionerSuitable;
  };

  var updateAdvertisements = function () {
    window.map.clearPins();
    window.map.renderMapPins(window.data.advertisements.filter(filterAdvertisments).slice(0, ADVERTISEMENT_COUNT));
  };

  var mapFiltersChangeHandler = function (evt) {
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

      window.map.clearPins();
      window.util.debounce(updateAdvertisements);
    }
  };

  window.filter = {
    ADVERTISEMENT_COUNT: ADVERTISEMENT_COUNT,
    resetFilter: resetFilter
  };

  mapFilters.addEventListener('change', mapFiltersChangeHandler);
})();
