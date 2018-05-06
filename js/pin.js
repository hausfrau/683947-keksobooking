'use strict';

(function () {
  var create = function (advertisement) {
    var templateElement = document.querySelector('template');
    var mapPinTemplateElement = templateElement.content.querySelector('.map__pin');
    var mapPinElement = mapPinTemplateElement.cloneNode(true);
    var imgElement = mapPinElement.querySelector('img');

    mapPinElement.tabindex = '0';
    mapPinElement.style.left = advertisement.location.x - imgElement.width / 2 + 'px';
    mapPinElement.style.top = advertisement.location.y - imgElement.height + 'px';
    imgElement.src = advertisement.author.avatar;
    mapPinElement.dataset.advertisement = JSON.stringify(advertisement);

    return mapPinElement;
  };

  window.pin = {
    create: create
  };
})();
