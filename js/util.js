'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var successElement = document.querySelector('.success');

  var createErrorMessage = function (message) {
    var errorElement = document.createElement('div');
    var errorText = document.createElement('p');
    errorText.textContent = message;
    errorText.style.fontSize = '30px';
    errorText.style.textAlign = 'center';
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
    errorElement.appendChild(errorText);
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
    removeClass: function (parentElement, className) {
      var childElements = parentElement.querySelectorAll('.' + className);

      for (var i = 0; i < childElements.length; i++) {
        childElements[i].classList.remove(className);
      }
    },
    showSuccess: function () {
      successElement.classList.remove('hidden');
      setTimeout(function () {
        successElement.classList.add('hidden');
      }, 3000);
    },
    showError: function (message, removeTimeout) {
      var errorElem = createErrorMessage(message);
      if (removeTimeout) {
        setTimeout(function () {
          document.body.removeChild(errorElem);
        }, removeTimeout);
      }
    }
  };
})();
