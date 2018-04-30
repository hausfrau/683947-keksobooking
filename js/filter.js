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
    window.filter.isUnFiltered = false;
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
      window.filter.isUnFiltered = true;
    }
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

  var sortAdvertisementsByPrice = function () {
    return window.data.advertisements.slice().sort(function (one, two) {
      var priceDifference = one.offer.price - two.offer.price;
      if (priceDifference === 0) {
        priceDifference = window.data.advertisements.indexOf(two) - window.data.advertisements.indexOf(one);
      }
      return priceDifference;
    });
  };

  var checkForSuitability = function (element) {
    var houseType = selectedOptions[HOUSING_TYPE];
    var houseTypeSuitable = false;
    if (houseType === 'any' || element.offer.type === houseType) {
      houseTypeSuitable = true;
    }

    var housePriceSuitable = false;
    if (isPriceSatisfies(element.offer.price, selectedOptions[HOUSING_PRICE])) {
      housePriceSuitable = true;
    }

    var houseRooms = selectedOptions[HOUSING_ROOMS];
    var houseRoomsSuitable = false;
    if (houseRooms === 'any' || element.offer.rooms === +houseRooms) {
      houseRoomsSuitable = true;
    }

    var houseGuests = selectedOptions[HOISING_GUESTS];
    var houseGuestsSuitable = false;
    if (houseGuests === 'any' || element.offer.guests === +houseGuests) {
      houseGuestsSuitable = true;
    }

    var filterWifiSuitable = false;
    if (!selectedOptions[FILTER_WIFI] ||
      (selectedOptions[FILTER_WIFI] &&
        element.offer.features &&
        element.offer.features.indexOf(featuresClassListMap[FILTER_WIFI]) !== -1)) {
      filterWifiSuitable = true;
    }

    var filterDishwasherSuitable = false;
    if (!selectedOptions[FILTER_DISHWASHER] ||
      (selectedOptions[FILTER_DISHWASHER] &&
        element.offer.features &&
        element.offer.features.indexOf(featuresClassListMap[FILTER_DISHWASHER]) !== -1)) {
      filterDishwasherSuitable = true;
    }

    var filterParkingSuitable = false;
    if (!selectedOptions[FILTER_PARKING] ||
      (selectedOptions[FILTER_PARKING] &&
        element.offer.features &&
        element.offer.features.indexOf(featuresClassListMap[FILTER_PARKING]) !== -1)) {
      filterParkingSuitable = true;
    }

    var filterWasherSuitable = false;
    if (!selectedOptions[FILTER_WASHER] ||
      (selectedOptions[FILTER_WASHER] &&
        element.offer.features &&
        element.offer.features.indexOf(featuresClassListMap[FILTER_WASHER]) !== -1)) {
      filterWasherSuitable = true;
    }

    var filterElevatorSuitable = false;
    if (!selectedOptions[FILTER_ELEVATOR] ||
      (selectedOptions[FILTER_ELEVATOR] &&
        element.offer.features &&
        element.offer.features.indexOf(featuresClassListMap[FILTER_ELEVATOR]) !== -1)) {
      filterElevatorSuitable = true;
    }

    var filterConditionerSuitable = false;
    if (!selectedOptions[FILTER_CONDITIONER] ||
      (selectedOptions[FILTER_CONDITIONER] &&
        element.offer.features &&
        element.offer.features.indexOf(featuresClassListMap[FILTER_CONDITIONER]) !== -1)) {
      filterConditionerSuitable = true;
    }

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

  window.filter = {
    checkForUnfiltered: checkForUnfiltered,
    resetFilter: resetFilter,
    sortAdvertisementsByPrice: sortAdvertisementsByPrice,
    checkForSuitability: checkForSuitability,
    selectedOptions: selectedOptions,
    isUnFiltered: isUnFiltered
  };

  window.filter.isUnFiltered = true;
})();
