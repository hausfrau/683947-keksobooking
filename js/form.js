'use strict';

(function () {
  var ERROR_COLOR = '3px solid red';
  var NOERROR_COLOR = '1px solid #d9d9d3';
  var ERROR_CLASS = 'error';
  var DEFAULT_PRICE = 1000;

  var adFormElement = document.querySelector('.ad-form');
  var titleElement = adFormElement.querySelector('#title');
  var descriptionElement = adFormElement.querySelector('#description');
  var typeElement = adFormElement.querySelector('#type');
  var priceElement = adFormElement.querySelector('#price');
  var timeinElement = adFormElement.querySelector('#timein');
  var timeoutElement = adFormElement.querySelector('#timeout');
  var roomNumberElement = adFormElement.querySelector('#room_number');
  var capacityElement = adFormElement.querySelector('#capacity');
  var submitElement = document.querySelector('.ad-form__submit');
  var resetElement = document.querySelector('.ad-form__reset');
  var inputElements = adFormElement.querySelectorAll('input');
  var fieldsetElements = document.querySelectorAll('fieldset');

  var checkForError = function (element) {
    if (!element.validity.valid) {
      element.classList.add(ERROR_CLASS);
    }
  };

  var colorizeErrors = function () {
    var errorElements = adFormElement.querySelectorAll('.' + ERROR_CLASS);

    Array.prototype.forEach.call(errorElements, function (item) {
      item.style.border = ERROR_COLOR;
    });
  };

  var setPrice = function (price) {
    priceElement.min = price;
    priceElement.placeholder = price;
  };

  var clearFields = function () {
    Array.prototype.forEach.call(inputElements, function (item) {
      switch (item.type) {
        case 'text':
        case 'file':
        case 'number':
          item.value = '';
          break;
        case 'checkbox':
          item.checked = false;
          break;
      }
    });

    descriptionElement.value = '';
    setPrice(DEFAULT_PRICE);
  };

  var selectOption = function (element, value) {
    element.value = value;
  };

  var setDefaultValues = function () {
    selectOption(typeElement, 'flat');
    selectOption(timeinElement, '12:00');
    selectOption(timeoutElement, '12:00');
    selectOption(roomNumberElement, '1');
    selectOption(capacityElement, '1');
  };

  var verifyPrice = function () {
    var typeSelectedValue = typeElement.options[typeElement.selectedIndex].value;
    var price = 0;

    switch (typeSelectedValue) {
      case 'flat':
        price = 1000;
        break;
      case 'house':
        price = 5000;
        break;
      case 'palace':
        price = 10000;
        break;
    }

    setPrice(price);
  };

  var verifyTime = function (evt) {
    var sourceSelect = evt.target.id === 'timein' ? timeinElement : timeoutElement;
    var targetSelect = evt.target.id === 'timein' ? timeoutElement : timeinElement;

    targetSelect.value = sourceSelect.options[sourceSelect.selectedIndex].value;
  };

  var verifyCapacity = function () {
    var roomNumberSelectedValue = roomNumberElement.options[roomNumberElement.selectedIndex].value;
    var capacitySelectedValue = capacityElement.options[capacityElement.selectedIndex].value;

    if (roomNumberSelectedValue === '1' && capacitySelectedValue !== '1') {
      capacityElement.setCustomValidity('Можно выбрать только "для 1 гостя"');
    } else if (roomNumberSelectedValue === '2' && (capacitySelectedValue !== '2' || capacitySelectedValue !== '1')) {
      capacityElement.setCustomValidity('Можно выбрать только "для 2 гостей" или "для 1 гостя"');
    } else if (roomNumberSelectedValue === '3' && capacitySelectedValue === '0') {
      capacityElement.setCustomValidity('Можно выбрать только "для 3 гостей" или "для 2 гостей" или "для 1 гостя"');
    } else if (roomNumberSelectedValue === '100' && capacitySelectedValue !== '0') {
      capacityElement.setCustomValidity('Можно выбрать только "не для гостей"');
    } else {
      capacityElement.setCustomValidity('');
    }
  };

  var selectOnChangeHandler = function (evt) {
    var nameElement = evt.target.name;

    switch (nameElement) {
      case 'avatar':
        window.photos.readFiles(evt);
        break;
      case 'images':
        window.photos.readFiles(evt);
        break;
      case 'type':
        verifyPrice();
        break;
      case 'timein':
      case 'timeout':
        verifyTime(evt);
        break;
      case 'room_number':
      case 'capacity':
        verifyCapacity();
        break;
    }
  };

  adFormElement.addEventListener('change', selectOnChangeHandler);
  adFormElement.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(adFormElement), function (response) {
      if (response) {
        window.util.showSuccess();
        resetButtonClickHandler();
      }
    },
    function (errorMessage) {
      window.util.createErrorMessage(errorMessage);
    });

    evt.preventDefault();
  });

  var submitButtonClickHandler = function () {
    clearErrors();
    checkForError(titleElement);
    checkForError(priceElement);
    checkForError(capacityElement);
    colorizeErrors();
  };

  submitElement.addEventListener('click', submitButtonClickHandler);

  var resetButtonClickHandler = function () {
    window.filter.toggle(true);
    window.filter.reset();
    window.map.setActiveState(false);
    window.card.toggleCardVisibility(false);
  };

  resetElement.addEventListener('click', resetButtonClickHandler);

  var clearErrors = function () {
    var errorElements = adFormElement.querySelectorAll('.' + ERROR_CLASS);

    Array.prototype.forEach.call(errorElements, function (item) {
      item.style.border = NOERROR_COLOR;
      item.classList.remove(ERROR_CLASS);
    });

  };

  var clear = function () {
    window.photos.clear();
    clearFields();
    setDefaultValues();
    clearErrors();
  };

  var toggleFieldsets = function (flag) {
    Array.prototype.forEach.call(fieldsetElements, function (item) {
      item.disabled = flag;
    });
  };

  window.form = {
    clear: clear,
    toggleFieldsets: toggleFieldsets
  };
})();
