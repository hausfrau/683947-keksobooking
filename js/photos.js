'use strict';

(function () {
  var ACCEPTED_TYPES = '.jpg, .jpeg, .png, .gif, .pjpeg';
  var EMPTY_AVATAR = 'img/muffin-grey.svg';
  var AD_FORM_PHOTO_CLASS = 'ad-form__photo';
  var FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/pjpeg',
    'image/png'
  ];

  var adFormHeaderElement = document.querySelector('.ad-form-header');
  var avatarElement = adFormHeaderElement.querySelector('#avatar');
  var headerPreviewElement = adFormHeaderElement.querySelector('.ad-form-header__preview');
  var headerPreviewImgElement = headerPreviewElement.querySelector('img');
  var adFormPhotoContainerElement = document.querySelector('.ad-form__photo-container');
  var imagesElement = adFormPhotoContainerElement.querySelector('#images');
  var adPhotoTemplateElement = adFormPhotoContainerElement.querySelector('.' + AD_FORM_PHOTO_CLASS);
  var dragSourceElement;

  var checkForValidFileType = function (file) {
    return FILE_TYPES.some(function (it) {
      return file.type === it;
    });
  };

  var dragenterHandler = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  var dragoverHandler = function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  var photoDragstartHandle = function (evt) {
    var currentPhoto = evt.currentTarget;

    dragSourceElement = currentPhoto;

    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setData('text/html', currentPhoto.innerHTML);
  };

  var photoDragoverHandle = function (evt) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }

    evt.dataTransfer.dropEffect = 'move';

    return false;
  };

  var photoDropHandle = function (evt) {
    var currentPhoto = evt.currentTarget;

    if (evt.stopPropagation) {
      evt.stopPropagation();
    }

    if (dragSourceElement !== currentPhoto) {
      dragSourceElement.innerHTML = currentPhoto.innerHTML;
      currentPhoto.innerHTML = evt.dataTransfer.getData('text/html');
    }

    return false;
  };

  var readAndPreviewFile = function (file, multiple) {
    if (!checkForValidFileType(file)) {
      return;
    }

    var reader = new FileReader();

    reader.addEventListener('load', function () {
      if (multiple) {
        var photoElement = adPhotoTemplateElement.cloneNode(true);
        photoElement.draggable = true;
        photoElement.addEventListener('dragstart', photoDragstartHandle);
        photoElement.addEventListener('dragover', photoDragoverHandle);
        photoElement.addEventListener('drop', photoDropHandle);
        var imgElement = document.createElement('img');
        imgElement.style.width = '100%';
        imgElement.src = reader.result;
        photoElement.appendChild(imgElement);
        adFormPhotoContainerElement.appendChild(photoElement);
      } else {
        headerPreviewImgElement.src = reader.result;
      }
    });

    reader.readAsDataURL(file);
  };

  var readFiles = function (evt) {
    var isAvatar = false;
    var dataTransfer = evt.dataTransfer;
    var files = [];

    if (evt.target.name === 'avatar' || evt.target.htmlFor === 'avatar') {
      isAvatar = true;
    }

    if (dataTransfer) {
      evt.stopPropagation();
      evt.preventDefault();

      files = dataTransfer.files;
    } else {
      files = isAvatar ? avatarElement.files : imagesElement.files;
    }

    if (files.length) {
      if (isAvatar) {
        readAndPreviewFile(files[0], !isAvatar);
      } else {
        Array.prototype.forEach.call(files, function (item) {
          readAndPreviewFile(item, !isAvatar);
        });

        adPhotoTemplateElement.remove();
      }
    }
  };

  var adFormHeaderDropHandler = function (evt) {
    readFiles(evt);
  };

  var adFormPhotoContainerDropHandler = function (evt) {
    readFiles(evt);
  };

  var bindListeners = function () {
    adFormHeaderElement.addEventListener('dragenter', dragenterHandler);
    adFormHeaderElement.addEventListener('dragover', dragoverHandler);
    adFormHeaderElement.addEventListener('drop', adFormHeaderDropHandler);
    adFormPhotoContainerElement.addEventListener('dragenter', dragenterHandler);
    adFormPhotoContainerElement.addEventListener('dragover', dragoverHandler);
    adFormPhotoContainerElement.addEventListener('drop', adFormPhotoContainerDropHandler);
  };

  var unbindListeners = function () {
    adFormHeaderElement.removeEventListener('dragenter', dragenterHandler);
    adFormHeaderElement.removeEventListener('dragover', dragoverHandler);
    adFormHeaderElement.removeEventListener('drop', adFormHeaderDropHandler);
    adFormPhotoContainerElement.removeEventListener('dragenter', dragenterHandler);
    adFormPhotoContainerElement.removeEventListener('dragover', dragoverHandler);
    adFormPhotoContainerElement.removeEventListener('drop', adFormPhotoContainerDropHandler);
  };

  var setDropSettings = function () {
    imagesElement.multiple = true;
    imagesElement.accept = ACCEPTED_TYPES;
    avatarElement.accept = ACCEPTED_TYPES;
  };

  var clear = function () {
    var photoElements = adFormPhotoContainerElement.querySelectorAll('.' + AD_FORM_PHOTO_CLASS);

    Array.prototype.forEach.call(photoElements, function (item) {
      adFormPhotoContainerElement.removeChild(item);
    });

    headerPreviewImgElement.src = EMPTY_AVATAR;
    adFormPhotoContainerElement.appendChild(adPhotoTemplateElement);
  };

  window.photos = {
    clear: clear,
    readFiles: readFiles,
    bindListeners: bindListeners,
    unbindListeners: unbindListeners
  };

  setDropSettings();
})();
