'use strict';

(function () {
  var NEIGHBOUR_COUNT = 8;
  var TITLE_OPTIONS = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPE_OPTIONS = ['palace', 'flat', 'house', 'bungalo'];
  var PHOTOS_OPTIONS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var FEATURE_OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var LOCATION_X_LIMITS = [300, 900];
  var LOCATION_Y_LIMITS = [150, 500];

  var advertisements = [];


  var shuffleTitleOptions = window.util.getShuffledArray(TITLE_OPTIONS);

  for (var i = 0; i < NEIGHBOUR_COUNT; i++) {
    var addressX = window.util.getRandomInt(LOCATION_X_LIMITS[0], LOCATION_X_LIMITS[1]);
    var addressY = window.util.getRandomInt(LOCATION_Y_LIMITS[0], LOCATION_Y_LIMITS[1]);

    advertisements[i] = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': shuffleTitleOptions[i],
        'address': addressX + ', ' + addressY,
        'price': window.util.getRandomInt(1000, 1000000),
        'type': TYPE_OPTIONS[window.util.getRandomInt(0, TYPE_OPTIONS.length - 1)],
        'rooms': window.util.getRandomInt(1, 5),
        'guests': window.util.getRandomInt(1, 10),
        'checkin': '1' + window.util.getRandomInt(2, 4) + ':00',
        'checkout': '1' + window.util.getRandomInt(2, 4) + ':00',
        'features': window.util.getShuffleArrayWithRandomLength(FEATURE_OPTIONS),
        'description': '',
        'photos': window.util.getShuffledArray(PHOTOS_OPTIONS)
      },
      'location': {
        'x': addressX,
        'y': addressY
      }
    };
  }

  window.data = advertisements;
})();
