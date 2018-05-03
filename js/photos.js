'use strict';

(function () {
  var ACCEPTED_TYPES = '.jpg, .jpeg, .png, .gif, .pjpeg';
  var EMPTY_AVATAR = 'img/muffin-grey.svg';
  var AD_FORM_PHOTO = 'ad-form__photo';
  var FILE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/pjpeg',
    'image/png'
  ];

  var adFormHeader = document.querySelector('.ad-form-header');
  var avatar = adFormHeader.querySelector('#avatar');
  var headerPreview = adFormHeader.querySelector('.ad-form-header__preview');
  var headerPreviewImg = headerPreview.querySelector('img');
  var adFormPhotoContainer = document.querySelector('.ad-form__photo-container');
  var images = adFormPhotoContainer.querySelector('#images');
  var adPhotoTemplate = adFormPhotoContainer.querySelector('.ad-form__photo');
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

  var readAndPreviewFile = function (file, previewParentElement, previewImgElement, multiple) {
    if (!checkForValidFileType(file)) {
      return;
    }

    var reader = new FileReader();

    reader.addEventListener('load', function () {
      if (multiple) {
        var photo = adPhotoTemplate.cloneNode(true);
        photo.draggable = true;
        photo.addEventListener('dragstart', photoDragstartHandle);
        photo.addEventListener('dragover', photoDragoverHandle);
        photo.addEventListener('drop', photoDropHandle);
        var img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.src = reader.result;
        photo.appendChild(img);
        previewParentElement.appendChild(photo);
      } else {
        previewImgElement.src = reader.result;
      }
    });

    reader.readAsDataURL(file);
  };

  var readFiles = function (evt, multiple) {
    var isAvatar = !multiple;
    var dt;
    var files;

    if (evt.target.name === 'avatar') {
      isAvatar = true;
    }

    dt = evt.dataTransfer;

    if (dt) {
      evt.stopPropagation();
      evt.preventDefault();

      files = dt.files;
    } else {
      files = isAvatar ? avatar.files : images.files;
    }

    if (files.length) {
      if (isAvatar) {
        var avatarFile = files[0];
        readAndPreviewFile(avatarFile, null, headerPreviewImg, false);
      } else {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          readAndPreviewFile(file, adFormPhotoContainer, null, true);
        }
      }
    }
  };

  var adFormHeaderDropHandler = function (evt) {
    readFiles(evt, false);
  };

  var adFormPhotoContainerDropHandler = function (evt) {
    readFiles(evt, true);
  };

  adFormHeader.addEventListener('dragenter', dragenterHandler);
  adFormHeader.addEventListener('dragover', dragoverHandler);
  adFormHeader.addEventListener('drop', adFormHeaderDropHandler);

  adFormPhotoContainer.addEventListener('dragenter', dragenterHandler);
  adFormPhotoContainer.addEventListener('dragover', dragoverHandler);
  adFormPhotoContainer.addEventListener('drop', adFormPhotoContainerDropHandler);


  var setDropSettings = function () {
    images.multiple = true;
    images.accept = ACCEPTED_TYPES;
    avatar.accept = ACCEPTED_TYPES;
  };

  var clearPhotos = function () {
    headerPreviewImg.src = EMPTY_AVATAR;
    window.util.removeChildren(adFormPhotoContainer, '.' + AD_FORM_PHOTO);
  };

  window.photos = {
    clearPhotos: clearPhotos,
    readFiles: readFiles
  };

  setDropSettings();
})();
