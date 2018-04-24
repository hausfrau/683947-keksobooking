'use strict';

(function () {
  var createPin = function (advertisement, ind) {
    var template = document.querySelector('template');
    var mapPinTemplate = template.content.querySelector('.map__pin');
    var mapPinElement = mapPinTemplate.cloneNode(true);
    var imgElement = mapPinElement.querySelector('img');

    mapPinElement.tabindex = '0';
    mapPinElement.style.left = advertisement.location.x - imgElement.width / 2 + 'px';
    mapPinElement.style.top = advertisement.location.y - imgElement.height + 'px';
    imgElement.src = advertisement.author.avatar;
    mapPinElement.dataset.index = ind;

    return mapPinElement;
  };

  window.pin = {
    createPin: createPin
  };
})();
