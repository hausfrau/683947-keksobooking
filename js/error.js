'use strict';

window.error = (function () {
  var ERROR_COLOR = '3px solid red';
  var NOERROR_COLOR = '1px solid #d9d9d3';
  var ERROR_CLASS = 'error';

  var adForm = document.querySelector('.ad-form');

  return {
    checkError: function (element) {
      if (!element.validity.valid) {
        element.classList.add(ERROR_CLASS);
      }
    },
    clearErrors: function () {
      var errorElements = adForm.querySelectorAll('.error');

      for (var i = 0; i < errorElements.length; i++) {
        var element = errorElements[i];
        element.style.border = NOERROR_COLOR;
        element.classList.remove(ERROR_CLASS);
      }
    },
    colorizeErrors: function () {
      var errorElements = adForm.querySelectorAll('.error');

      for (var i = 0; i < errorElements.length; i++) {
        errorElements[i].style.border = ERROR_COLOR;
      }
    }
  };
})();
