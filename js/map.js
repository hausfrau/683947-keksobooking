'use strict';

var NEIGHBOUR_COUNT = 8;
var titleOptions = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var typeOptions = ['palace', 'flat', 'house', 'bungalo'];
var featureOptions = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosOptions = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var locationXLimits = [300, 900];
var locationYLimits = [150, 500];
var neighbourAdvertisements = [];
var typesSet = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var template = document.querySelector('template');
var articleMapCardTemplate = template.content.querySelector('.map__card');
var buttonMapPinTemplate = template.content.querySelector('.map__pin');

var getRandomInt = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

var getShuffleArray = function (sourceArray) {
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

var getShuffleArrayWithShuffleLength = function (sourceArray) {
  return getShuffleArray(sourceArray).slice(0, getRandomInt(1, sourceArray.length));
};

var generateData = function () {
  var shuffleTitleOptions = getShuffleArray(titleOptions);

  for (var i = 0; i < NEIGHBOUR_COUNT; i++) {
    var addressX = getRandomInt(locationXLimits[0], locationXLimits[1]);
    var addressY = getRandomInt(locationYLimits[0], locationYLimits[1]);
    neighbourAdvertisements[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': shuffleTitleOptions[i],
        'address': addressX + ', ' + addressY,
        'price': getRandomInt(1000, 1000000),
        'type': typeOptions[getRandomInt(0, typeOptions.length - 1)],
        'rooms': getRandomInt(1, 5),
        'guests': getRandomInt(1, 10),
        'checkin': '1' + getRandomInt(2, 4) + ':00',
        'checkout': '1' + getRandomInt(2, 4) + ':00',
        'features': getShuffleArrayWithShuffleLength(featureOptions),
        'description': '',
        'photos': getShuffleArray(photosOptions)
      },
      'location': {
        'x': addressX,
        'y': addressY
      }
    };
  }
};

var renderAvatar = function (dataElement) {
  var buttonMapPinElement = buttonMapPinTemplate.cloneNode(true);
  var imgElement = buttonMapPinElement.querySelector('img');
  buttonMapPinElement.style.left = dataElement.location.x - imgElement.width / 2 + 'px';
  buttonMapPinElement.style.top = dataElement.location.y - imgElement.height + 'px';
  imgElement.src = dataElement.author.avatar;
  return buttonMapPinElement;
};

var renderMapPins = function (parentElement, dataArray) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataArray.length; i++) {
    fragment.appendChild(renderAvatar(dataArray[i]));
  }
  parentElement.appendChild(fragment);
};

var renderPopupPhoto = function (parentElement, dataElement) {
  var imgElement = parentElement.querySelector('img').cloneNode(true);
  imgElement.src = dataElement;
  return imgElement;
};

var renderPopupPhotos = function (parentElement, dataElement) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataElement.offer.photos.length; i++) {
    fragment.appendChild(renderPopupPhoto(parentElement, dataElement.offer.photos[i]));
  }
  parentElement.removeChild(parentElement.querySelector('img'));
  parentElement.appendChild(fragment);
};

var renderPopupFuture = function (dataElement) {
  var liElement = document.createElement('li');
  liElement.classList.add('popup__feature');
  liElement.classList.add('popup__feature--' + dataElement);
  return liElement;
};

var renderPopupFutures = function (parentElement, dataElement) {
  var fragment = document.createDocumentFragment();
  var ulElement = document.createElement('ul');
  parentElement.removeChild(parentElement.querySelector('.popup__features'));
  ulElement.className = 'popup__features';
  for (var i = 0; i < dataElement.offer.features.length; i++) {
    fragment.appendChild(renderPopupFuture(dataElement.offer.features[i]));
  }
  ulElement.appendChild(fragment);
  parentElement.appendChild(ulElement);
};

var renderAdvertisement = function (dataElement) {
  var articleMapCardElement = articleMapCardTemplate.cloneNode(true);
  var imgElement = articleMapCardElement.querySelector('.popup__avatar');
  var divPopupPhotosElement = articleMapCardElement.querySelector('.popup__photos');
  var offerRooms = dataElement.offer.rooms;
  var offerRoomsStringEnd = ' комнат';
  var offerGuestsCount = dataElement.offer.guests;

  if (offerRooms === 1) {
    offerRoomsStringEnd += 'а';
  } else if (offerRooms !== 5) {
    offerRoomsStringEnd += 'ы';
  }
  imgElement.src = dataElement.author.avatar;
  imgElement.alt = dataElement.offer.title;
  articleMapCardElement.querySelector('.popup__title').textContent = dataElement.offer.title;
  articleMapCardElement.querySelector('.popup__text--address').textContent = dataElement.offer.address;
  articleMapCardElement.querySelector('.popup__text--price').innerHTML = dataElement.offer.price + '&#x20bd;<span>/ночь</span>';
  articleMapCardElement.querySelector('.popup__type').textContent = typesSet[dataElement.offer.type];
  articleMapCardElement.querySelector('.popup__text--capacity').textContent = offerRooms + offerRoomsStringEnd + ' для ' + offerGuestsCount + (offerGuestsCount === 1 ? ' гостя' : ' гостей');
  articleMapCardElement.querySelector('.popup__text--time').textContent = 'заезд после ' + dataElement.offer.checkin + ', выезд до ' + dataElement.offer.checkout;
  renderPopupFutures(articleMapCardElement, dataElement);
  articleMapCardElement.querySelector('.popup__description').textContent = dataElement.offer.description;
  renderPopupPhotos(divPopupPhotosElement, dataElement);
  return articleMapCardElement;
};

var renderAdvertisements = function (dataArray) {
  var mapSection = document.querySelector('.map');
  var mapFiltersContainerDiv = document.querySelector('.map__filters-container');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < dataArray.length; i++) {
    fragment.appendChild(renderAdvertisement(dataArray[i]));
  }
  mapSection.insertBefore(fragment, mapFiltersContainerDiv);
};

document.querySelector('.map').classList.remove('map--faded');
generateData();
renderMapPins(document.querySelector('.map__pins'), neighbourAdvertisements);
renderAdvertisements(neighbourAdvertisements.slice(0, 1));
