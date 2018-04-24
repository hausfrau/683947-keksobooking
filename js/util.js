'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.util = {
    getRandomInt: function (min, max) {
      var rand = min + Math.random() * (max + 1 - min);
      rand = Math.floor(rand);
      return rand;
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action(evt);
      }
    },
    getShuffledArray: function (sourceArray) {
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
    },
    getShuffleArrayWithRandomLength: function (sourceArray) {
      return this.getShuffledArray(sourceArray).slice(0, this.getRandomInt(1, sourceArray.length));
    }
  };
})();
