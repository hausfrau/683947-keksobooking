'use strict';

(function () {
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
  var adFormPhoto = adFormPhotoContainer.querySelector('.ad-form__photo');
  var ulAdFormPhoto;
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

  var liDragstartHandle = function (evt) {
    dragSourceElement = this;

    evt.dataTransfer.effectAllowed = 'move';
    evt.dataTransfer.setData('text/html', this.innerHTML);
  };

  var liDragoverHandle = function (evt) {
    if (evt.preventDefault) {
      evt.preventDefault();
    }

    evt.dataTransfer.dropEffect = 'move';

    return false;
  };

  var liDropHandle = function (evt) {
    if (evt.stopPropagation) {
      evt.stopPropagation();
    }

    if (dragSourceElement !== this) {
      dragSourceElement.innerHTML = this.innerHTML;
      this.innerHTML = evt.dataTransfer.getData('text/html');
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
        var li = document.createElement('li');
        li.style.marginBottom = '5px';
        li.draggable = true;
        li.addEventListener('dragstart', liDragstartHandle);
        li.addEventListener('dragover', liDragoverHandle);
        li.addEventListener('drop', liDropHandle);
        li.style.cursor = 'pointer';
        var img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.src = reader.result;
        li.appendChild(img);
        previewParentElement.appendChild(li);
      } else {
        previewImgElement.src = reader.result;
      }
    });

    reader.readAsDataURL(file);
  };

  var readFiles = function (evt, isAvatar) {
    var dt;
    var files;
    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();

      dt = evt.dataTransfer;
      files = dt.files;
    } else {
      files = isAvatar ? avatar.files : images.files;
    }

    if (files.length) {
      if (isAvatar) {
        var avatarFile = files[0];
        readAndPreviewFile(avatarFile, null, headerPreviewImg, false);
      } else {
        var ul = adFormPhoto.querySelector('ul');
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          readAndPreviewFile(file, ul, null, true);
        }
      }
    }
  };

  var adFormHeaderDropHandler = function (evt) {
    readFiles(evt, true);
  };

  var adFormPhotoContainerDropHandler = function (evt) {
    readFiles(evt, false);
  };

  adFormHeader.addEventListener('dragenter', dragenterHandler);
  adFormHeader.addEventListener('dragover', dragoverHandler);
  adFormHeader.addEventListener('drop', adFormHeaderDropHandler);

  adFormPhotoContainer.addEventListener('dragenter', dragenterHandler);
  adFormPhotoContainer.addEventListener('dragover', dragoverHandler);
  adFormPhotoContainer.addEventListener('drop', adFormPhotoContainerDropHandler);


  var setDropSettings = function () {
    images.multiple = true;
    images.accept = '.jpg, .jpeg, .png, .gif, .pjpeg';
    avatar.accept = '.jpg, .jpeg, .png, .gif, .pjpeg';
    ulAdFormPhoto = document.createElement('ul');
    ulAdFormPhoto.style.display = 'flex';
    ulAdFormPhoto.style.flexDirection = 'column';
    ulAdFormPhoto.style.padding = '0px';
    ulAdFormPhoto.style.listStyle = 'none';
    adFormPhoto.appendChild(ulAdFormPhoto);
  };

  var clearPhotos = function () {
    headerPreviewImg.src = 'img/muffin-grey.svg';
    window.util.removeChildren(ulAdFormPhoto, 'li');
  };

  window.photos = {
    clearPhotos: clearPhotos,
    readFiles: readFiles
  };

  setDropSettings();
})();
