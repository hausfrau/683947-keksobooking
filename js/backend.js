'use strict';

(function () {

  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var SUCCESSFUL_STATUS = 200;
  var INVALID_REQUEST_STATUS = 400;
  var NOTHING_FOUND_STATUS = 404;

  var load = function (onLoad, onError) {
    window.data.isDataLoading = true;

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case SUCCESSFUL_STATUS:
          window.data.isDataLoading = false;
          onLoad(xhr.response);
          break;
        case INVALID_REQUEST_STATUS:
          error = 'Неверный запрос';
          break;
        case NOTHING_FOUND_STATUS:
          error = 'Ничего не найдено';
          break;

        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
      if (error) {
        onError(error);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка: \n' + 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполнится за ' + xhr.timeout + ' мс.');
    });

    xhr.timeout = 10000;

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  var upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onLoad(xhr.response);
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка: \n' + 'статус ответа: ' + xhr.status + '\n' + xhr.statusText);
    });

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload,
    isDataLoading: false
  };
})();
