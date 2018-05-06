'use strict';

(function () {
  var HIDDEN = 'hidden';
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var ERROR_TIMEOUT = 10000;
  var SUCCESS_TIMEOUT = 3000;
  var DEBOUNCE_INTERVAL = 500;

  var successElement = document.querySelector('.success');
  var lastTimeout;

  var createErrorMessage = function (message) {
    var errorElement = document.createElement('div');
    var errorTextElement = document.createElement('p');
    errorTextElement.textContent = message;
    errorTextElement.style.fontSize = '30px';
    errorTextElement.style.textAlign = 'center';
    errorElement.style.position = 'absolute';
    errorElement.style.width = '700px';
    errorElement.style.height = '100px';
    errorElement.style.left = 0;
    errorElement.style.top = 0;
    errorElement.style.right = 0;
    errorElement.style.bottom = 0;
    errorElement.style.margin = 'auto';
    errorElement.style.backgroundColor = '#ff7f50';
    errorElement.style.border = 'px solid #d4d4d4';
    errorElement.style.borderRadius = '10px';
    errorElement.style.boxShadow = '0 0 80px black';
    errorElement.style.opacity = 0.9;
    errorElement.style.zIndex = 100;
    errorElement.appendChild(errorTextElement);
    document.body.insertAdjacentElement('afterbegin', errorElement);
    return errorElement;
  };

  window.util = {
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
    showSuccess: function () {
      successElement.classList.remove(HIDDEN);
      setTimeout(function () {
        successElement.classList.add(HIDDEN);
      }, SUCCESS_TIMEOUT);
    },
    showError: function (message) {
      var errorElem = createErrorMessage(message);
      setTimeout(function () {
        document.body.removeChild(errorElem);
      }, ERROR_TIMEOUT);
    },
    debounce: function (func) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL);
    }
  };
})();
