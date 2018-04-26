'use strict';

(function () {

  var advertisements = [];

  var setData = function (response) {
    for (var i = 0; i < response.length; i++) {
      var advertisement = response[i];
      advertisements[i] = {
        'author': {
          'avatar': advertisement.author.avatar
        },
        'offer': {
          'title': advertisement.offer.title,
          'address': advertisement.offer.address,
          'price': advertisement.offer.price,
          'type': advertisement.offer.type,
          'rooms': advertisement.offer.rooms,
          'guests': advertisement.offer.guests,
          'checkin': advertisement.offer.checkin,
          'checkout': advertisement.offer.checkout,
          'features': advertisement.offer.features,
          'description': advertisement.offer.description,
          'photos': advertisement.offer.photos
        },
        'location': {
          'x': advertisement.location.x,
          'y': advertisement.location.y
        }
      };
    }
  };

  var isDataLoaded = function () {
    return advertisements.length !== 0;
  };

  window.data = {
    setData: setData,
    advertisements: advertisements,
    isDataLoaded: isDataLoaded
  };
})();
