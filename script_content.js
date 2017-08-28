(function() {
  const keys = {};

  window.addEventListener('message', function(msg) {
    if (msg.source !== window) {
      return;
    }

    const previousLength = Object.keys(keys).length;

    if (msg.data.from === 'page' && msg.data.subject === 'keys') {
      Object.keys(msg.data.keys).forEach(function(key) {
        keys[key] = true;
      });
    }

    if (msg.data.from === 'page' && msg.data.subject === 'newKey') {
      keys[msg.data.key] = true;

      chrome.runtime.sendMessage({
        from: 'content',
        subject: 'newKey',
        key: msg.data.key,
      });
    }

    if (previousLength === 0 && Object.keys(keys).length !== 0) {
      chrome.runtime.sendMessage({
        from: 'content',
        subject: 'showPageAction',
      });
    }
  });

  chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.from === 'popup' && msg.subject === 'wantKeys') {
      sendResponse({ keys: keys });
    }
  });

  const s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', chrome.extension.getURL('script_inject.js'));
  document.documentElement.appendChild(s);

  setTimeout(function() {
    window.postMessage({ from: 'content', subject: 'wantKeys' }, '*');
  }, 100);
})();
