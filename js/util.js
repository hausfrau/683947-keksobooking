'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var success = document.querySelector('.success');
  var err;

  var createErrorMessage = function (message) {
    err = document.createElement('div');
    var p = document.createElement('p');
    p.textContent = message;
    p.style.fontSize = '30px';
    p.style.textAlign = 'center';
    p.style.verticalAlign = 'middle';
    err.style.position = 'absolute';
    err.style.width = '700px';
    err.style.height = '200px';
    err.style.left = 0;
    err.style.top = 0;
    err.style.right = 0;
    err.style.bottom = 0;
    err.style.margin = 'auto';
    err.style.backgroundColor = '#afeeee';
    err.style.border = 'px solid #D4D4D4';
    err.style.borderRadius = '10px';
    err.style.boxShadow = '0 0 80px black';
    err.style.opacity = 0.9;
    err.style.zIndex = 100;
    err.appendChild(p);
    document.body.insertAdjacentElement('afterbegin', err);
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
      success.classList.remove('hidden');
      setTimeout(function () {
        success.classList.add('hidden');
      }, 3000);
    },
    showError: function (message, removeTimeout) {
      createErrorMessage(message);
      if (removeTimeout) {
        setTimeout(function () {
          document.body.removeChild(err);
        }, removeTimeout);
      }
    }
  };
})();
