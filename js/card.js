'use strict';

(function () {
  var PRICE_SUFFIX = '&#x20bd;/ночь';
  var HIDDEN = 'hidden';
  var POPUP_FEATURE = 'popup__feature';
  var POPUP_FEATURES = 'popup__features';
  var TYPES_SET = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var mapElement = document.querySelector('.map');
  var mapFiltersContainerElement = document.querySelector('.map__filters-container');
  var templateElement = document.querySelector('template');
  var mapCardTemplateElement = templateElement.content.querySelector('.map__card');
  var mapCardElement = mapCardTemplateElement.cloneNode(true);
  var titleElement = mapCardElement.querySelector('.popup__title');
  var addressElement = mapCardElement.querySelector('.popup__text--address');
  var priceElement = mapCardElement.querySelector('.popup__text--price');
  var typeElement = mapCardElement.querySelector('.popup__type');
  var capacityElement = mapCardElement.querySelector('.popup__text--capacity');
  var timeElement = mapCardElement.querySelector('.popup__text--time');
  var descriptionElement = mapCardElement.querySelector('.popup__description');
  var avatarElement = mapCardElement.querySelector('.popup__avatar');
  var popupPhotosElement = mapCardElement.querySelector('.popup__photos');
  var photoTemplateElement = popupPhotosElement.querySelector('img');
  var closeElement = mapCardElement.querySelector('.popup__close');
  var priceSuffixElement = document.createElement('span');

  var renderPopupPhoto = function (photo) {
    var photoElement = photoTemplateElement.cloneNode(true);

    photoElement.src = photo;

    return photoElement;
  };

  var renderPopupPhotos = function (photos) {
    var fragment = document.createDocumentFragment();

    photos.forEach(function (item) {
      fragment.appendChild(renderPopupPhoto(item));
    });

    popupPhotosElement.appendChild(fragment);
  };

  var renderPopupFeature = function (feature) {
    var liElement = document.createElement('li');

    liElement.classList.add(POPUP_FEATURE);
    liElement.classList.add(POPUP_FEATURE + '--' + feature);

    return liElement;
  };

  var renderPopupFeatures = function (parentElement, features) {
    if (features.length) {
      var fragment = document.createDocumentFragment();
      var ulElement = document.createElement('ul');
      ulElement.className = POPUP_FEATURES;

      features.forEach(function (item) {
        fragment.appendChild(renderPopupFeature(item));
      });

      ulElement.appendChild(fragment);
      parentElement.appendChild(ulElement);
    }
  };

  var clearCard = function () {
    var featureElement = mapCardElement.querySelector('.' + POPUP_FEATURES);

    avatarElement.src = '';
    avatarElement.alt = '';
    titleElement.textContent = '';
    addressElement.textContent = '';
    priceElement.innerHTML = '';
    typeElement.textContent = '';
    capacityElement.textContent = '';
    timeElement.textContent = '';

    if (featureElement) {
      mapCardElement.removeChild(featureElement);
    }

    descriptionElement.textContent = '';
    popupPhotosElement.innerHTML = '';
    popupPhotosElement.appendChild(photoTemplateElement);
  };

  var fillCard = function (advertisement) {
    var childElements = mapCardElement.querySelectorAll('.' + HIDDEN);

    Array.prototype.forEach.call(childElements, function (item) {
      item.classList.remove(HIDDEN);
    });

    clearCard();

    avatarElement.src = advertisement.author.avatar;

    var title = advertisement.offer.title;
    if (title) {
      avatarElement.alt = title;
      titleElement.textContent = title;
    } else {
      avatarElement.alt = '';
      titleElement.classList.add(HIDDEN);
    }

    var address = advertisement.offer.address;
    if (address) {
      addressElement.textContent = address;
    } else {
      addressElement.classList.add(HIDDEN);
    }

    var price = advertisement.offer.price;
    if (price) {
      priceSuffixElement.innerHTML = PRICE_SUFFIX;
      priceElement.textContent = price;
      priceElement.appendChild(priceSuffixElement);
    } else {
      priceElement.classList.add(HIDDEN);
    }

    var type = advertisement.offer.type;
    if (type) {
      typeElement.textContent = TYPES_SET[type];
    } else {
      typeElement.classList.add(HIDDEN);
    }

    var offerRooms = advertisement.offer.rooms;
    var offerGuestsCount = advertisement.offer.guests;
    var offerRoomsStringEnd = ' комнат';
    if (offerRooms && offerGuestsCount) {
      if (offerRooms === 1) {
        offerRoomsStringEnd += 'а';
      } else if (offerRooms !== 5) {
        offerRoomsStringEnd += 'ы';
      }
      capacityElement.textContent = offerRooms + offerRoomsStringEnd + ' для ' + offerGuestsCount + (offerGuestsCount === 1 ? ' гостя' : ' гостей');
    } else {
      capacityElement.classList.add(HIDDEN);
    }

    var checkin = advertisement.offer.checkin;
    var checkout = advertisement.offer.checkout;
    if (checkin && checkout && checkin !== '0:00' && checkout !== '0:00') {
      timeElement.textContent = 'Заезд после ' + checkin + ', выезд до ' + checkout;
    } else {
      timeElement.classList.add(HIDDEN);
    }

    renderPopupFeatures(mapCardElement, advertisement.offer.features);

    var description = advertisement.offer.description;
    if (description) {
      descriptionElement.textContent = description;
    } else {
      descriptionElement.classList.add(HIDDEN);
    }

    var photos = advertisement.offer.photos;
    if (photos.length) {
      renderPopupPhotos(photos);
    } else {
      popupPhotosElement.classList.add(HIDDEN);
    }

    photoTemplateElement.remove();

    return mapCardElement;
  };

  var toggleCardVisibility = function (flag) {
    if (flag) {
      mapCardElement.classList.remove(HIDDEN);
    } else {
      mapCardElement.classList.add(HIDDEN);
    }
  };

  var closeButtonClickHandler = function () {
    close();
  };

  var escKeydownHandler = function (evt) {
    window.util.isEscEvent(evt, close);
  };

  var enterKeydownHandler = function (e) {
    window.util.isEnterEvent(e, close);
  };

  var close = function () {
    toggleCardVisibility(false);

    document.removeEventListener('keydown', escKeydownHandler);
    closeElement.removeEventListener('click', closeButtonClickHandler);
    closeElement.removeEventListener('keydown', enterKeydownHandler);
  };

  var open = function (advertisement) {
    mapElement.insertBefore(fillCard(advertisement), mapFiltersContainerElement);

    document.addEventListener('keydown', escKeydownHandler);

    if (closeElement) {
      closeElement.tabindex = '0';

      closeElement.addEventListener('click', closeButtonClickHandler);
      closeElement.addEventListener('keydown', enterKeydownHandler);
    }

    toggleCardVisibility(true);
  };

  window.card = {
    close: close,
    open: open,
    toggleCardVisibility: toggleCardVisibility
  };
})();
