'use strict';

(function () {

  var advertisements = [];
  var success = document.querySelector('.success');

  var errorHandler = function (errorMessage) {
    success.classList.remove('hidden');
    var mes = success.querySelector('.success__message');
    mes.insertAdjacentHTML(errorMessage);
  };

  var successHandler = function (advertisementsArray) {
    advertisements = advertisementsArray;
    window.data = advertisements;
  };

  window.load(successHandler, errorHandler);
})();
