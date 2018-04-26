'use strict';

(function () {

  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';

  var load = function (onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;
        case 400:
          error = 'Неверный запрос';
          break;
        case 404:
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
    upload: upload
  };
})();
