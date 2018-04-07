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

var getShuffleArray = function (sourceArray) {
  var returnArray = sourceArray.slice(0, sourceArray.length);
  for (var i = returnArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = returnArray[i];
    returnArray[i] = returnArray[j];
    returnArray[j] = temp;
  }
  return returnArray;
};

var getShuffleArrayWithShuffleLength = function (sourceArray) {
  return getShuffleArray(sourceArray).slice(0, getRandomInt(1, sourceArray.length));
};

var shuffleTitleOptions = getShuffleArray(titleOptions);

for (var i = 0; i < NEIGHBOUR_COUNT; i++) {
  neighbourAdvertisements[i] = {
    'author': {
      'avatar': 'img/avatars/user0' + (i + 1) + '.png'
    },
    'offer': {
      'title': shuffleTitleOptions[i],
      'address': getRandomInt(100, 1200) + ', ' + getRandomInt(100, 750),
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
      'x': getRandomInt(locationXLimits[0], locationXLimits[1]),
      'y': getRandomInt(locationYLimits[0], locationYLimits[1])
    }
  };
}
