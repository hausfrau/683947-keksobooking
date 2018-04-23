'use strict';

(function () {
  var ERROR_COLOR = '3px solid red';
  var NOERROR_COLOR = '1px solid #d9d9d3';
  var ERROR_CLASS = 'error';

  var adForm = document.querySelector('.ad-form');
  var title = adForm.querySelector('#title');
  var descriptionTextArea = adForm.querySelector('#description');
  var typeSelect = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeinSelect = adForm.querySelector('#timein');
  var timeoutSelect = adForm.querySelector('#timeout');
  var roomNumberSelect = adForm.querySelector('#room_number');
  var capacitySelect = adForm.querySelector('#capacity');
  var submitButton = document.querySelector('.ad-form__submit');
  var resetButton = document.querySelector('.ad-form__reset');

  var checkError = function (element) {
    if (!element.validity.valid) {
      element.classList.add(ERROR_CLASS);
    }
  };

  var colorizeErrors = function () {
    var errorElements = adForm.querySelectorAll('.error');

    for (var i = 0; i < errorElements.length; i++) {
      errorElements[i].style.border = ERROR_COLOR;
    }
  };

  var setPrice = function (price) {
    priceInput.min = price;
    priceInput.placeholder = price;
  };

  var clearFields = function () {
    var allInputs = adForm.querySelectorAll('input');

    for (var i = 0; i < allInputs.length; i++) {
      var element = allInputs[i];

      switch (element.type) {
        case 'text':
        case 'file':
        case 'number':
          element.value = '';
          break;
        case 'checkbox':
          element.checked = false;
          break;
      }
    }
    descriptionTextArea.value = '';
    setPrice(1000);
  };

  var selectOption = function (element, value) {
    element.value = value;
  };

  var placeDefaultValues = function () {
    selectOption(typeSelect, 'flat');
    selectOption(timeinSelect, '12:00');
    selectOption(timeoutSelect, '12:00');
    selectOption(roomNumberSelect, '1');
    selectOption(capacitySelect, '1');
  };

  var verifyPrice = function () {
    var typeSelectedValue = typeSelect.options[typeSelect.selectedIndex].value;
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
    var sourceSelect = evt.target.id === 'timein' ? timeinSelect : timeoutSelect;
    var targetSelect = evt.target.id === 'timein' ? timeoutSelect : timeinSelect;

    targetSelect.value = sourceSelect.options[sourceSelect.selectedIndex].value;
  };

  var verifyCapacity = function () {
    var roomNumberSelectedValue = roomNumberSelect.options[roomNumberSelect.selectedIndex].value;
    var capacitySelectedValue = capacitySelect.options[capacitySelect.selectedIndex].value;

    if (roomNumberSelectedValue === '1' && capacitySelectedValue !== '1') {
      capacitySelect.setCustomValidity('Можно выбрать только "для 1 гостя"');
    } else if (roomNumberSelectedValue === '2' && (capacitySelectedValue !== '2' || capacitySelectedValue !== '1')) {
      capacitySelect.setCustomValidity('Можно выбрать только "для 2 гостей" или "для 1 гостя"');
    } else if (roomNumberSelectedValue === '3' && capacitySelectedValue === '0') {
      capacitySelect.setCustomValidity('Можно выбрать только "для 3 гостей" или "для 2 гостей" или "для 1 гостя"');
    } else if (roomNumberSelectedValue === '100' && capacitySelectedValue !== '0') {
      capacitySelect.setCustomValidity('Можно выбрать только "не для гостей"');
    } else {
      capacitySelect.setCustomValidity('');
    }
  };

  var selectsOnChangeHandler = function (evt) {
    var nameElement = evt.target.name;

    switch (nameElement) {
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

  adForm.addEventListener('change', selectsOnChangeHandler);

  var validate = function () {
    window.form.clearErrors();
    checkError(title);
    checkError(priceInput);
    checkError(capacitySelect);
    colorizeErrors();
  };

  submitButton.addEventListener('click', validate);

  var resetForm = function () {
    window.map.activatePage(false);
    window.card.showCard(false);
  };

  resetButton.addEventListener('click', resetForm);

  window.form = {
    clearErrors: function () {
      var errorElements = adForm.querySelectorAll('.error');

      for (var i = 0; i < errorElements.length; i++) {
        var element = errorElements[i];
        element.style.border = NOERROR_COLOR;
        element.classList.remove(ERROR_CLASS);
      }
    },
    clearForm: function () {
      clearFields();
      placeDefaultValues();
    },
    disableFieldsets: function (flag) {
      var fieldsets = document.querySelectorAll('fieldset');

      for (var i = 0; i < fieldsets.length; i++) {
        fieldsets[i].disabled = flag;
      }
    }
  };
})();
