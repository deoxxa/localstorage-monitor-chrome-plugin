window.addEventListener('DOMContentLoaded', function() {
  const kl = document.querySelector('#keyList');
  const kc = document.querySelector('#keyCount');

  const keys = {};

  function render() {
    kc.innerHTML = `Keys: ${Object.keys(keys).length}`;

    kl.innerHTML = '';

    Object.keys(keys).forEach(function(key) {
      const li = document.createElement('li');
      li.appendChild(document.createTextNode(key));
      kl.appendChild(li);
    });
  }

  chrome.runtime.onMessage.addListener(function(msg) {
    console.log(msg);

    if (msg.from === 'content' && msg.subject === 'newKey') {
      keys[msg.key] = true;
      render();
    }
  });

  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    function(tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: 'popup', subject: 'wantKeys' },
        function(response) {
          Object.keys(response.keys).forEach(function(key) {
            keys[key] = true;
          });

          render();
        }
      );
    }
  );
});
