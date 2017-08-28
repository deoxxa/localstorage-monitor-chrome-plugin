(function() {
  const keys = {};

  function recordAccess(key, value) {
    if (!keys[key]) {
      keys[key] = true;

      window.postMessage({ from: 'page', subject: 'newKey', key: key }, '*');
    }

    return value;
  }

  const _getItem = Storage.prototype.getItem;

  Storage.prototype.getItem = function getItem(key) {
    return recordAccess(key, _getItem.call(this, key));
  };

  const ls = new Proxy(localStorage, {
    get: function(target, key) {
      if (typeof target[key] === 'function') {
        return target[key].bind(target);
      }

      return recordAccess(key, target[key]);
    },
  });

  Object.defineProperty(window, 'localStorage', { value: ls });

  window.addEventListener('message', function(msg) {
    if (msg.source !== window) {
      return;
    }

    if (msg.data.from === 'content' && msg.data.subject === 'wantKeys') {
      window.postMessage({ from: 'page', subject: 'keys', keys: keys }, '*');
    }
  });
})();
