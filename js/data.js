'use strict';

(function () {
  var advertisements = [];
  var filteredAdvertisements = [];

  var setData = function (response) {
    window.data.advertisements = response;
    window.data.filteredAdvertisements = response;
  };

  var isDataLoaded = function () {
    return window.data.advertisements.length !== 0;
  };

  window.data = {
    setData: setData,
    advertisements: advertisements,
    filteredAdvertisements: filteredAdvertisements,
    isDataLoaded: isDataLoaded
  };
})();
