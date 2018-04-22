'use strict';
var NEIGHBOUR_COUNT = 8;
var TITLE_OPTIONS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE_OPTIONS = ['palace', 'flat', 'house', 'bungalo'];
var FEATURE_OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_OPTIONS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_X_LIMITS = [300, 900];
var LOCATION_Y_LIMITS = [150, 500];
var MAP_PIN_MAIN_X_LIMITS = [0, 1135];
var MAP_PIN_MAIN_Y_LIMITS = [150, 625];
var HIDDEN = 'hidden';
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var TAIL_HEIGHT = 22;
var NOERROR_COLOR = '1px solid #d9d9d3';
var ERROR_COLOR = '3px solid red';
var ERROR_CLASS = 'error';
var TYPES_SET = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var advertisements = [];
var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var adForm = document.querySelector('.ad-form');
var title = adForm.querySelector('#title');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapPinMain = document.querySelector('.map__pin--main');
var mapPinMainStartLeft = mapPinMain.style.left;
var mapPinMainStartTop = mapPinMain.style.top;
var mapPinMainWidth = mapPinMain.querySelector('img').width;
var mapPinMainHeight = mapPinMain.querySelector('img').height;
var address = document.querySelector('#address');
var template = document.querySelector('template');
var mapCardTemplate = template.content.querySelector('.map__card');
var mapCardElement = mapCardTemplate.cloneNode(true);
var mapPinTemplate = template.content.querySelector('.map__pin');
var priceInput = adForm.querySelector('#price');
var descriptionTextArea = adForm.querySelector('#description');
var typeSelect = adForm.querySelector('#type');
var timeinSelect = adForm.querySelector('#timein');
var timeoutSelect = adForm.querySelector('#timeout');
var roomNumberSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');
var submitButton = document.querySelector('.ad-form__submit');
var resetButton = document.querySelector('.ad-form__reset');
var startCoords = {};

var getRandomInt = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

var clearAvatars = function () {
  var allmapPins = mapPins.querySelectorAll('.map__pin:not(.map__pin--main)');

  for (var i = 0; i < allmapPins.length; i++) {
    mapPins.removeChild(allmapPins[i]);
  }
};

var showCard = function (flag) {
  if (flag) {
    mapCardElement.classList.remove(HIDDEN);
  } else {
    mapCardElement.classList.add(HIDDEN);
  }
};

var setPrice = function (price) {
  priceInput.min = price;
  priceInput.placeholder = price;
};

var clearFields = function () {
  var allInputs = adForm.querySelectorAll('input');

  for (var i = 0; i < allInputs.length; i++) {
    var element = allInputs[i];
    if (element.type === 'text' || element.type === 'file' || element.type === 'number') {
      element.value = '';
    } else if (element.type === 'checkbox') {
      element.checked = false;
    }
  }
  descriptionTextArea.value = '';
  setPrice(1000);
};

var selectOption = function (element, value) {
  element.value = value;
};

var placeDefaultValues = function () {
  selectOption(typeSelect, 'flat');
  selectOption(timeinSelect, '12:00');
  selectOption(timeoutSelect, '12:00');
  selectOption(roomNumberSelect, '1');
  selectOption(capacitySelect, '1');
};

var clearForm = function () {
  clearFields();
  placeDefaultValues();
};

var initAddress = function () {
  address.value = (parseInt(mapPinMain.style.left, 10) - mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) - mapPinMainHeight / 2);
  address.readOnly = true;
};

var disableFieldsets = function (flag) {
  var fieldsets = document.querySelectorAll('fieldset');

  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = flag;
  }
};

var updateAddress = function () {
  address.value = (parseInt(mapPinMain.style.left, 10) + mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) + mapPinMainHeight / 2 + TAIL_HEIGHT);
};

var mouseUpHandler = function (upEvt) {
  upEvt.preventDefault();
  activatePage(true);
  renderMapPins(document.querySelector('.map__pins'), advertisements);
  updateAddress();
  document.removeEventListener('mousemove', mouseMoveHandler);
  document.removeEventListener('mouseup', mouseUpHandler);
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

var mouseDownHandler = function (evt) {
  evt.preventDefault();

  enableMapAndForm(true);

  startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
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

var activatePage = function (activeState) {
  enableMapAndForm(activeState);
  clearAvatars();
  clearForm();
  disableFieldsets(!activeState);
  clearErrors();

  if (!activeState) {
    resetMapPinMain();
    mapPinMain.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }

  initAddress();
};

var closeCard = function () {
  showCard(false);
  document.removeEventListener('keydown', closeButtonEscPressHandler);
};

var closeButtonEscPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeCard();
  }
};

var openCard = function () {
  showCard(true);
  document.addEventListener('keydown', closeButtonEscPressHandler);
};

var renderCard = function (advertisement) {
  var fragment = document.createDocumentFragment();

  openCard();
  fragment.appendChild(fillCard(advertisement));
  map.insertBefore(fragment, mapFiltersContainer);
};

var mapPinsClickHandler = function (evt) {
  var element = evt.target;
  var index;

  while (!element.classList.contains('map__pin') && element.parentElement !== null) {
    element = element.parentElement;
  }

  index = element.dataset.index;

  if (isFinite(index)) {
    renderCard(advertisements[index]);

    var closeButton = mapCardElement.querySelector('.popup__close');

    if (closeButton !== null) {
      closeButton.tabindex = '0';
      var closeButtonClickHandler = function () {
        closeCard();
      };

      closeButton.addEventListener('click', closeButtonClickHandler);

      closeButton.addEventListener('keydown', function (e) {
        if (e.keyCode === ENTER_KEYCODE) {
          closeCard();
        }
      });
    }
  }
};

mapPins.addEventListener('click', mapPinsClickHandler);

mapPins.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    mapPinsClickHandler(evt);
  }
});

var getShuffledArray = function (sourceArray) {
  var returnArray = sourceArray.slice(0, sourceArray.length);
  var j = 0;
  var temp = 0;

  for (var i = returnArray.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = returnArray[i];
    returnArray[i] = returnArray[j];
    returnArray[j] = temp;
  }

  return returnArray;
};

var getShuffleArrayWithRandomLength = function (sourceArray) {
  return getShuffledArray(sourceArray).slice(0, getRandomInt(1, sourceArray.length));
};

var generateData = function () {
  var shuffleTitleOptions = getShuffledArray(TITLE_OPTIONS);

  for (var i = 0; i < NEIGHBOUR_COUNT; i++) {
    var addressX = getRandomInt(LOCATION_X_LIMITS[0], LOCATION_X_LIMITS[1]);
    var addressY = getRandomInt(LOCATION_Y_LIMITS[0], LOCATION_Y_LIMITS[1]);

    advertisements[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': shuffleTitleOptions[i],
        'address': addressX + ', ' + addressY,
        'price': getRandomInt(1000, 1000000),
        'type': TYPE_OPTIONS[getRandomInt(0, TYPE_OPTIONS.length - 1)],
        'rooms': getRandomInt(1, 5),
        'guests': getRandomInt(1, 10),
        'checkin': '1' + getRandomInt(2, 4) + ':00',
        'checkout': '1' + getRandomInt(2, 4) + ':00',
        'features': getShuffleArrayWithRandomLength(FEATURE_OPTIONS),
        'description': '',
        'photos': getShuffledArray(PHOTOS_OPTIONS)
      },
      'location': {
        'x': addressX,
        'y': addressY
      }
    };
  }
};

var renderAvatar = function (advertisement, ind) {
  var mapPinElement = mapPinTemplate.cloneNode(true);
  var imgElement = mapPinElement.querySelector('img');

  mapPinElement.tabindex = '0';
  mapPinElement.style.left = advertisement.location.x - imgElement.width / 2 + 'px';
  mapPinElement.style.top = advertisement.location.y - imgElement.height + 'px';
  imgElement.src = advertisement.author.avatar;
  mapPinElement.dataset.index = ind;

  return mapPinElement;
};

var renderMapPins = function (parentElement, advertisementsArray) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < advertisementsArray.length; i++) {
    fragment.appendChild(renderAvatar(advertisementsArray[i], i));
  }

  parentElement.appendChild(fragment);
};

var renderPopupPhoto = function (parentElement, photo) {
  var imgElement = parentElement.querySelector('img').cloneNode(true);

  imgElement.src = photo;
  imgElement.classList.remove(HIDDEN);

  return imgElement;
};

var renderPopupPhotos = function (parentElement, photos) {
  var fragment = document.createDocumentFragment();
  var allImgs = parentElement.querySelectorAll('img:not(.hidden)');

  for (i = 0; i < allImgs.length; i++) {
    parentElement.removeChild(allImgs[i]);
  }

  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPopupPhoto(parentElement, photos[i]));
  }

  parentElement.appendChild(fragment);
};

var renderPopupFeature = function (feature) {
  var liElement = document.createElement('li');

  liElement.classList.add('popup__feature');
  liElement.classList.add('popup__feature--' + feature);

  return liElement;
};

var renderPopupFeatures = function (parentElement, features) {
  var fragment = document.createDocumentFragment();
  var ulElement = document.createElement('ul');

  parentElement.removeChild(parentElement.querySelector('.popup__features'));
  ulElement.className = 'popup__features';

  for (var i = 0; i < features.length; i++) {
    fragment.appendChild(renderPopupFeature(features[i]));
  }

  ulElement.appendChild(fragment);
  parentElement.appendChild(ulElement);
};

var fillCard = function (advertisement) {
  var imgElement = mapCardElement.querySelector('.popup__avatar');
  var popupPhotosElement = mapCardElement.querySelector('.popup__photos');

  popupPhotosElement.querySelector('img').classList.add(HIDDEN);

  var offerRooms = advertisement.offer.rooms;
  var offerRoomsStringEnd = ' комнат';
  var offerGuestsCount = advertisement.offer.guests;

  if (offerRooms === 1) {
    offerRoomsStringEnd += 'а';
  } else if (offerRooms !== 5) {
    offerRoomsStringEnd += 'ы';
  }

  imgElement.src = advertisement.author.avatar;
  imgElement.alt = advertisement.offer.title;
  mapCardElement.querySelector('.popup__title').textContent = advertisement.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = advertisement.offer.address;
  mapCardElement.querySelector('.popup__text--price').innerHTML = advertisement.offer.price + '&#x20bd;<span>/ночь</span>';
  mapCardElement.querySelector('.popup__type').textContent = TYPES_SET[advertisement.offer.type];
  mapCardElement.querySelector('.popup__text--capacity').textContent = offerRooms + offerRoomsStringEnd + ' для ' + offerGuestsCount + (offerGuestsCount === 1 ? ' гостя' : ' гостей');
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;
  renderPopupFeatures(mapCardElement, advertisement.offer.features);
  mapCardElement.querySelector('.popup__description').textContent = advertisement.offer.description;
  renderPopupPhotos(popupPhotosElement, advertisement.offer.photos);

  return mapCardElement;
};

var verifyPrice = function () {
  var typeSelectedValue = typeSelect.options[typeSelect.selectedIndex].value;
  var price = 0;

  switch (typeSelectedValue) {
    case 'flat':
      price = 1000;
      break;
    case 'house':
      price = 5000;
      break;
    case 'palace':
      price = 10000;
      break;
  }

  setPrice(price);
};

var verifyTime = function (evt) {
  var sourceSelect = evt.target.id === 'timein' ? timeinSelect : timeoutSelect;
  var targetSelect = evt.target.id === 'timein' ? timeoutSelect : timeinSelect;

  targetSelect.value = sourceSelect.options[sourceSelect.selectedIndex].value;
};

var verifyCapacity = function () {
  var roomNumberSelectedValue = roomNumberSelect.options[roomNumberSelect.selectedIndex].value;
  var capacitySelectedValue = capacitySelect.options[capacitySelect.selectedIndex].value;

  if (roomNumberSelectedValue === '1' && capacitySelectedValue !== '1') {
    capacitySelect.setCustomValidity('Можно выбрать только "для 1 гостя"');
  } else if (roomNumberSelectedValue === '2' && (capacitySelectedValue !== '2' || capacitySelectedValue !== '1')) {
    capacitySelect.setCustomValidity('Можно выбрать только "для 2 гостей" или "для 1 гостя"');
  } else if (roomNumberSelectedValue === '3' && capacitySelectedValue === '0') {
    capacitySelect.setCustomValidity('Можно выбрать только "для 3 гостей" или "для 2 гостей" или "для 1 гостя"');
  } else if (roomNumberSelectedValue === '100' && capacitySelectedValue !== '0') {
    capacitySelect.setCustomValidity('Можно выбрать только "не для гостей"');
  } else {
    capacitySelect.setCustomValidity('');
  }
};

var selectsOnChangeHandler = function (evt) {
  var nameElement = evt.target.name;

  switch (nameElement) {
    case 'type':
      verifyPrice();
      break;
    case 'timein':
    case 'timeout':
      verifyTime(evt);
      break;
    case 'room_number':
    case 'capacity':
      verifyCapacity();
      break;
  }
};

adForm.addEventListener('change', selectsOnChangeHandler);

var clearErrors = function () {
  var errorElements = adForm.querySelectorAll('.error');

  for (var i = 0; i < errorElements.length; i++) {
    var element = errorElements[i];
    element.style.border = NOERROR_COLOR;
    element.classList.remove(ERROR_CLASS);
  }
};

var checkError = function (element) {
  if (!element.validity.valid) {
    element.classList.add(ERROR_CLASS);
  }
};

var colorizeErrors = function () {
  var errorElements = adForm.querySelectorAll('.error');

  for (var i = 0; i < errorElements.length; i++) {
    errorElements[i].style.border = ERROR_COLOR;
  }
};

var validate = function () {
  clearErrors();
  checkError(title);
  checkError(priceInput);
  checkError(capacitySelect);
  colorizeErrors();
};

submitButton.addEventListener('click', validate);

var resetMapPinMain = function () {
  mapPinMain.style.left = mapPinMainStartLeft;
  mapPinMain.style.top = mapPinMainStartTop;
};

var resetForm = function () {
  mapPinMain.removeEventListener('mousedown', mouseDownHandler);
  activatePage(false);
  showCard(false);
};

resetButton.addEventListener('click', resetForm);
activatePage(false);
generateData();
mapPinMain.draggable = true;
