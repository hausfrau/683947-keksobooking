'use strict';

var NEIGHBOUR_COUNT = 8;
var TITLE_OPTIONS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE_OPTIONS = ['palace', 'flat', 'house', 'bungalo'];
var FEATURE_OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_OPTIONS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_X_LIMITS = [300, 900];
var LOCATION_Y_LIMITS = [150, 500];
var HIDDEN = 'hidden';
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
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
var mapFiltersContainer = document.querySelector('.map__filters-container');
var mapPinMain = document.querySelector('.map__pin--main');
var mapPinMainWidth = mapPinMain.querySelector('img').width;
var mapPinMainHeight = mapPinMain.querySelector('img').height;
var address = document.querySelector('#address');
var template = document.querySelector('template');
var mapCardTemplate = template.content.querySelector('.map__card');
var mapCardElement = mapCardTemplate.cloneNode(true);
var mapPinTemplate = template.content.querySelector('.map__pin');

var activatePage = function (activeState) {
  var MAP_FADED = 'map--faded';
  var AD_FORM_DISABLED = 'ad-form--disabled';
  if (activeState) {
    map.classList.remove(MAP_FADED);
    adForm.classList.remove(AD_FORM_DISABLED);
  } else {
    map.classList.add(MAP_FADED);
    adForm.classList.add(AD_FORM_DISABLED);
  }
  initAddress();
  disableFieldsets(!activeState);
};

var initAddress = function () {
  address.value = (parseInt(mapPinMain.style.left, 10) - mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) - mapPinMainHeight / 2);
  address.readOnly = true;
};

var updateAddress = function () {
  address.value = (parseInt(mapPinMain.style.left, 10) + mapPinMainWidth / 2) + ', ' + (parseInt(mapPinMain.style.top, 10) + mapPinMainHeight / 2 + 22);
};

var closeButtonEscPressHandler = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeCard();
  }
};

var closeCard = function () {
  mapCardElement.classList.add(HIDDEN);
  document.removeEventListener('keydown', closeButtonEscPressHandler);
};

var openCard = function () {
  mapCardElement.classList.remove(HIDDEN);
  document.addEventListener('keydown', closeButtonEscPressHandler);
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

      var closeButtonHandler = function () {
        closeCard();
      };

      closeButton.addEventListener('click', closeButtonHandler);

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

var mapPinMainMouseUpHandler = function () {
  activatePage(true);
  generateData();
  renderMapPins(document.querySelector('.map__pins'), advertisements);
  updateAddress();
  mapPinMain.removeEventListener('mouseup', mapPinMainMouseUpHandler);
};

mapPinMain.addEventListener('mouseup', mapPinMainMouseUpHandler);

var disableFieldsets = function (flag) {
  var fieldsets = document.querySelectorAll('fieldset');
  for (var i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = flag;
  }
};

var getRandomInt = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

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
  mapPinElement.tabindex = '0';
  var imgElement = mapPinElement.querySelector('img');
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

var renderCard = function (advertisement) {
  openCard();
  var fragment = document.createDocumentFragment();
  fragment.appendChild(fillCard(advertisement));
  map.insertBefore(fragment, mapFiltersContainer);
};

activatePage(false);
