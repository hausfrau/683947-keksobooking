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
  var closeButton = mapCardElement.querySelector('.popup__close');

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
