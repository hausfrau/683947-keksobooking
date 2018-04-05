'use strict';

var NEIGHBOUR_COUNT = 8;
var titleOptions = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var typeOptions = ['palace', 'flat', 'house', 'bungalo'];
var featureOptions = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosOptions = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var locationXLimits = [300, 900];
var locationYLimits = [150, 500];
var neighbourAdvertisements = [];

var getRandomInt = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
};

for (var i = 0; i < NEIGHBOUR_COUNT; i++) {
  neighbourAdvertisements[i] = {
    'author': {
      'avatar': 'img/avatars/user0' + (i + 1) + '.png'
    },
    'offer': {
      'title': titleOptions[getRandomInt(0, titleOptions.length - 1)],
      'address': getRandomInt(100, 600) + ', ' + getRandomInt(100, 600),
      'price': getRandomInt(1000, 1000000),
      'type': typeOptions[getRandomInt(0, typeOptions.length - 1)],
      'rooms': getRandomInt(1, 5),
      'guests': getRandomInt(1, 100),
      'checkin': '1' + getRandomInt(2, 4) + ':00',
      'checkout': '1' + getRandomInt(2, 4) + ':00',
      'features': featureOptions[0],
      'description': '',
      'photos': photosOptions[0]
    },
    'location': {
      'x': locationXLimits[0],
      'y': locationYLimits[0]
    }
  };
}

