'use strict';

(function () {

  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';

  window.load = function (onLoad, onError) {

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполнится за ' + xhr.timeout + ' мс.');
    });

    xhr.timeout = 10000;

    xhr.open('GET', LOAD_URL);
    xhr.send();

  };

  window.upload = function (data, onLoad, onError) {
    var UPLOAD_URL = 'https://js.dump.academy/keksobooking';

    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      onLoad(xhr.response);
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка: ' + 'статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  (function () {
    var URL = 'https://js.dump.academy/code-and-magick';

    window.upload = function (data, onSuccess) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        onSuccess(xhr.response);
      });

      xhr.open('POST', URL);
      xhr.send(data);
    };
  })();
})();
