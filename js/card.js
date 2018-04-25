'use strict';

(function () {
  var HIDDEN = 'hidden';
  var TYPES_SET = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var template = document.querySelector('template');
  var mapCardTemplate = template.content.querySelector('.map__card');
  var mapCardElement = mapCardTemplate.cloneNode(true);
  var imgElement = mapCardElement.querySelector('.popup__avatar');
  var popupPhotosElement = mapCardElement.querySelector('.popup__photos');
  var closeButton = mapCardElement.querySelector('.popup__close');

  var renderPopupPhoto = function (parentElement, photo) {
    var imgEl = parentElement.querySelector('img').cloneNode(true);

    imgEl.src = photo;
    imgEl.classList.remove(HIDDEN);

    return imgEl;
  };

  var renderPopupPhotos = function (parentElement, photos) {
    var allImgs = parentElement.querySelectorAll('img:not(.hidden)');

    for (i = 0; i < allImgs.length; i++) {
      parentElement.removeChild(allImgs[i]);
    }

    if (photos.length > 0) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < photos.length; i++) {
        fragment.appendChild(renderPopupPhoto(parentElement, photos[i]));
      }

      parentElement.appendChild(fragment);
    }
  };

  var renderPopupFeature = function (feature) {
    var liElement = document.createElement('li');

    liElement.classList.add('popup__feature');
    liElement.classList.add('popup__feature--' + feature);

    return liElement;
  };

  var renderPopupFeatures = function (parentElement, features) {
    if (features.length > 0) {
      var fragment = document.createDocumentFragment();
      var ulElement = document.createElement('ul');
      ulElement.className = 'popup__features';

      for (var i = 0; i < features.length; i++) {
        fragment.appendChild(renderPopupFeature(features[i]));
      }

      ulElement.appendChild(fragment);
      parentElement.appendChild(ulElement);
    }
  };

  var clearPhotos = function () {
    var allImgs = popupPhotosElement.querySelectorAll('img');

    for (var i = 1; i < allImgs.length; i++) {
      popupPhotosElement.removeChild(allImgs[i]);
    }
  };

  var clearCard = function () {
    imgElement.src = '';
    imgElement.alt = '';
    mapCardElement.querySelector('.popup__title').textContent = '';
    mapCardElement.querySelector('.popup__text--address').textContent = '';
    mapCardElement.querySelector('.popup__text--price').innerHTML = '';
    mapCardElement.querySelector('.popup__type').textContent = '';
    mapCardElement.querySelector('.popup__text--capacity').textContent = '';
    mapCardElement.querySelector('.popup__text--time').textContent = '';
    var features = mapCardElement.querySelector('.popup__features');
    if (features !== null) {
      mapCardElement.removeChild(features);
    }
    mapCardElement.querySelector('.popup__description').textContent = '';
    clearPhotos();
  };

  var fillCard = function (advertisement) {
    window.util.removeClass(mapCardElement, 'hidden');

    clearCard();

    popupPhotosElement.querySelector('img').classList.add(HIDDEN);

    imgElement.src = advertisement.author.avatar;

    var dataElement = advertisement.offer.title;
    var cardElement = mapCardElement.querySelector('.popup__title');
    if (dataElement === 'undefined' || dataElement.trim().length === 0) {
      imgElement.alt = '';
      cardElement.classList.add(HIDDEN);
    } else {
      imgElement.alt = dataElement;
      cardElement.textContent = dataElement;
    }

    dataElement = advertisement.offer.address;
    cardElement = mapCardElement.querySelector('.popup__text--address');
    if (dataElement === 'undefined' || dataElement.trim().length === 0) {
      cardElement.classList.add(HIDDEN);
    } else {
      cardElement.textContent = dataElement;
    }

    dataElement = advertisement.offer.price;
    cardElement = mapCardElement.querySelector('.popup__text--price');
    if (dataElement === 'undefined' || dataElement === 0) {
      cardElement.classList.add(HIDDEN);
    } else {
      cardElement.innerHTML = dataElement + '&#x20bd;<span>/ночь</span>';
    }

    dataElement = advertisement.offer.type;
    cardElement = mapCardElement.querySelector('.popup__type');
    if (dataElement === 'undefined' || dataElement.trim().length === 0) {
      cardElement.classList.add(HIDDEN);
    } else {
      cardElement.textContent = TYPES_SET[dataElement];
    }

    var offerRooms = advertisement.offer.rooms;
    var offerRoomsStringEnd = ' комнат';
    var offerGuestsCount = advertisement.offer.guests;
    cardElement = mapCardElement.querySelector('.popup__text--capacity');
    if (offerRooms === 'undefined' || offerRooms === 0 || offerGuestsCount === 'undefined' || offerGuestsCount === 0) {
      cardElement.classList.add(HIDDEN);
    } else {
      if (offerRooms === 1) {
        offerRoomsStringEnd += 'а';
      } else if (offerRooms !== 5) {
        offerRoomsStringEnd += 'ы';
      }
      cardElement.textContent = offerRooms + offerRoomsStringEnd + ' для ' + offerGuestsCount + (offerGuestsCount === 1 ? ' гостя' : ' гостей');
    }

    var checkin = advertisement.offer.checkin;
    var checkout = advertisement.offer.checkout;
    cardElement = mapCardElement.querySelector('.popup__text--time');
    if (checkin === 'undefined' || checkin.trim().length === 0 || checkin.trim() === '0:00' || checkout === 'undefined' || checkout.trim().length === 0 || checkout.trim() === '0:00') {
      cardElement.classList.add(HIDDEN);
    } else {
      cardElement.textContent = 'Заезд после ' + checkin + ', выезд до ' + checkout;
    }

    renderPopupFeatures(mapCardElement, advertisement.offer.features);

    dataElement = advertisement.offer.description;
    cardElement = mapCardElement.querySelector('.popup__description');
    if (dataElement === 'undefined' || dataElement.trim().length === 0) {
      cardElement.classList.add(HIDDEN);
    } else {
      cardElement.textContent = dataElement;
    }

    renderPopupPhotos(popupPhotosElement, advertisement.offer.photos);

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
    closeCard();
  };

  var closeCard = function () {
    toggleCardVisibility(false);

    document.removeEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, closeCard);
    });
    closeButton.removeEventListener('click', closeButtonClickHandler);
    closeButton.removeEventListener('keydown', function (e) {
      window.util.isEnterEvent(e, closeCard);
    });
  };

  var openCard = function (advertisement) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(fillCard(advertisement));
    map.insertBefore(fragment, mapFiltersContainer);

    document.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, closeCard);
    });

    if (closeButton !== null) {
      closeButton.tabindex = '0';

      closeButton.addEventListener('click', closeButtonClickHandler);

      closeButton.addEventListener('keydown', function (e) {
        window.util.isEnterEvent(e, closeCard);
      });
    }

    toggleCardVisibility(true);
  };

  window.card = {
    openCard: openCard,
    toggleCardVisibility: toggleCardVisibility
  };
})();
