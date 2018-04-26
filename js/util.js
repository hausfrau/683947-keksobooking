'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var success = document.querySelector('.success');
  var successMessage = success.querySelector('.success__message');

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
    removeClass: function (parentElement, className) {
      var childElements = parentElement.querySelectorAll('.' + className);

      for (var i = 0; i < childElements.length; i++) {
        childElements[i].classList.remove(className);
      }
    },
    showSuccess: function (isOK, okMessage, errorMessage) {
      successMessage.textContent = isOK ? okMessage : errorMessage;
      success.classList.remove('hidden');
      setTimeout(function () {
        success.classList.add('hidden');
        successMessage.textContent = '';
      }, 3000);
    },
    showPreloader: function (flag, message) {
      if (flag) {
        success.classList.remove('hidden');
        successMessage.textContent = message;
      } else {
        success.classList.add('hidden');
        successMessage.textContent = '';
      }
    }
  };
})();
