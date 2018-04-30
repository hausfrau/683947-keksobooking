'use strict';

(function () {
  var advertisements = [];

  var setData = function (response) {
    window.data.advertisements = response;
  };

  var isDataLoaded = function () {
    return window.data.advertisements.length !== 0;
  };

  window.data = {
    setData: setData,
    advertisements: advertisements,
    isDataLoaded: isDataLoaded
  };
})();
