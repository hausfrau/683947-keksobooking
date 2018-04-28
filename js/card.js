'use strict';

(function () {
  var HIDDEN = 'hidden';
  var POPUP_FEATURE = 'popup__feature';
  var POPUP_FEATURES = 'popup__features';
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
  var titleElement = mapCardElement.querySelector('.popup__title');
  var addressElement = mapCardElement.querySelector('.popup__text--address');
  var priceElement = mapCardElement.querySelector('.popup__text--price');
  var typeElement = mapCardElement.querySelector('.popup__type');
  var capacityElement = mapCardElement.querySelector('.popup__text--capacity');
  var timeElement = mapCardElement.querySelector('.popup__text--time');
  var descriptionElement = mapCardElement.querySelector('.popup__description');
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

    liElement.classList.add(POPUP_FEATURE);
    liElement.classList.add(POPUP_FEATURE + '--' + feature);

    return liElement;
  };

  var renderPopupFeatures = function (parentElement, featuresArray) {
    var featuresArrayLength = featuresArray.length;
    if (featuresArrayLength > 0) {
      var fragment = document.createDocumentFragment();
      var ulElement = document.createElement('ul');
      ulElement.className = POPUP_FEATURES;

      for (var i = 0; i < featuresArrayLength; i++) {
        fragment.appendChild(renderPopupFeature(featuresArray[i]));
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
    var features = mapCardElement.querySelector('.' + POPUP_FEATURES);

    imgElement.src = '';
    imgElement.alt = '';
    titleElement.textContent = '';
    addressElement.textContent = '';
    priceElement.innerHTML = '';
    typeElement.textContent = '';
    capacityElement.textContent = '';
    timeElement.textContent = '';
    if (features !== null) {
      mapCardElement.removeChild(features);
    }
    descriptionElement.textContent = '';
    clearPhotos();
  };

  var fillCard = function (advertisement) {
    window.util.removeClass(mapCardElement, HIDDEN);

    clearCard();

    popupPhotosElement.querySelector('img').classList.add(HIDDEN);

    imgElement.src = advertisement.author.avatar;

    var title = advertisement.offer.title;
    if (title) {
      imgElement.alt = title;
      titleElement.textContent = title;
    } else {
      imgElement.alt = '';
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
      priceElement.innerHTML = price + '&#x20bd;<span>/ночь</span>';
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
