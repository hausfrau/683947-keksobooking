'use strict';

(function () {
  var advertisements = [];

  var set = function (response) {
    window.data.advertisements = response;
  };

  var isLoaded = function () {
    return window.data.advertisements.length !== 0;
  };

  window.data = {
    set: set,
    advertisements: advertisements,
    isLoaded: isLoaded
  };
})();
