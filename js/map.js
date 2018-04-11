'use strict';

var NEIGHBOUR_COUNT = 8;
var TITLE_OPTIONS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPE_OPTIONS = ['palace', 'flat', 'house', 'bungalo'];
var FEATURE_OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_OPTIONS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_X_LIMITS = [300, 900];
var LOCATION_Y_LIMITS = [150, 500];
var TYPES_SET = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};
var neighbourAdvertisements = [];
var mapSection = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var mapFiltersContainerDiv = document.querySelector('.map__filters-container');
var mapPinMainButton = document.querySelector('.map__pin--main');
var MAP_PIN_MAIN_BUTTON_WIDTH = mapPinMainButton.querySelector('img').width;
var MAP_PIN_MAIN_BUTTON_HEIGHT = mapPinMainButton.querySelector('img').height;
var address = document.querySelector('#address');
var template = document.querySelector('template');
var articleMapCardTemplate = template.content.querySelector('.map__card');
var articleMapCardElement = articleMapCardTemplate.cloneNode(true);
var buttonMapPinTemplate = template.content.querySelector('.map__pin');
var launchCount = 0;
var renderCardLaunchCount = 0;

var setState = function (stateCite) {
  if (stateCite) {
    mapSection.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    setDisableToFieldsets(!stateCite);
  } else {
    mapSection.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    setDisableToFieldsets(!stateCite);
    setFirstLaunchSettings();

  }
};

var setFirstLaunchSettings = function () {
  mapPinMainButton.draggable = true;
  address.placeholder = String(parseInt(mapPinMainButton.style.left, 10) - MAP_PIN_MAIN_BUTTON_WIDTH / 2) + ', ' + String(parseInt(mapPinMainButton.style.top, 10) - MAP_PIN_MAIN_BUTTON_HEIGHT / 2);
};

var avatarButtonHandler = function (evt) {
  var avatarImgSrc = evt.target.src;
  var user = avatarImgSrc.substr((avatarImgSrc.indexOf('user') + 5), 1);
  renderCard(neighbourAdvertisements.slice(user - 1, user));
  var closeButton = document.querySelector('.popup__close');
  var closeButtonHandler = function () {
    articleMapCardElement.classList.add('hidden');
  };
  closeButton.addEventListener('click', closeButtonHandler);
};

var mapPinMainButtonHandler = function () {
  launchCount++;
  if (launchCount === 1) {
    setState(true);
    generateData();
    renderMapPins(document.querySelector('.map__pins'), neighbourAdvertisements);
    var allAvatar = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = 0; i < allAvatar.length; i++) {
      allAvatar[i].addEventListener('click', avatarButtonHandler);
    }
  }
};
mapPinMainButton.addEventListener('mouseup', mapPinMainButtonHandler);

var setDisableToFieldsets = function (flag) {
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
    neighbourAdvertisements[i] = {
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

var renderAvatar = function (advertisement) {
  var buttonMapPinElement = buttonMapPinTemplate.cloneNode(true);
  var imgElement = buttonMapPinElement.querySelector('img');
  buttonMapPinElement.style.left = advertisement.location.x - imgElement.width / 2 + 'px';
  buttonMapPinElement.style.top = advertisement.location.y - imgElement.height + 'px';
  imgElement.src = advertisement.author.avatar;
  return buttonMapPinElement;
};

var renderMapPins = function (parentElement, advertisements) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < advertisements.length; i++) {
    fragment.appendChild(renderAvatar(advertisements[i]));
  }
  parentElement.appendChild(fragment);
};

var renderPopupPhoto = function (parentElement, photo) {
  var imgElement = parentElement.querySelector('img').cloneNode(true);
  imgElement.src = photo;
  if (renderCardLaunchCount !== 1 && imgElement.classList.contains('hidden')) {
    imgElement.classList.remove('hidden');
  }
  return imgElement;
};

var renderPopupPhotos = function (parentElement, photos) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(renderPopupPhoto(parentElement, photos[i]));
  }
  if (launchCount === 1 && renderCardLaunchCount === 1) {
    parentElement.querySelector('img').classList.add('hidden');
  }
  if (parentElement.children.length > 1) {
    var allImgs = parentElement.querySelectorAll('img:not(.hidden)');
    for (i = 0; i < allImgs.length; i++) {
      parentElement.removeChild(allImgs[i]);
    }
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
  var imgElement = articleMapCardElement.querySelector('.popup__avatar');
  var divPopupPhotosElement = articleMapCardElement.querySelector('.popup__photos');
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
  articleMapCardElement.querySelector('.popup__title').textContent = advertisement.offer.title;
  articleMapCardElement.querySelector('.popup__text--address').textContent = advertisement.offer.address;
  articleMapCardElement.querySelector('.popup__text--price').innerHTML = advertisement.offer.price + '&#x20bd;<span>/ночь</span>';
  articleMapCardElement.querySelector('.popup__type').textContent = TYPES_SET[advertisement.offer.type];
  articleMapCardElement.querySelector('.popup__text--capacity').textContent = offerRooms + offerRoomsStringEnd + ' для ' + offerGuestsCount + (offerGuestsCount === 1 ? ' гостя' : ' гостей');
  articleMapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ', выезд до ' + advertisement.offer.checkout;
  renderPopupFeatures(articleMapCardElement, advertisement.offer.features);
  articleMapCardElement.querySelector('.popup__description').textContent = advertisement.offer.description;
  renderPopupPhotos(divPopupPhotosElement, advertisement.offer.photos);
  return articleMapCardElement;
};

var renderCard = function (advertisements) {
  renderCardLaunchCount++;
  if (renderCardLaunchCount !== 1) {
    articleMapCardElement.classList.remove('hidden');
  }
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < advertisements.length; i++) {
    fragment.appendChild(fillCard(advertisements[i]));
  }
  mapSection.insertBefore(fragment, mapFiltersContainerDiv);
};

setState(false);
