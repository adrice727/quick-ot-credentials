const copy = require('copy-to-clipboard');
const opentok = require('./opentok');

const app = () => {

  const $credentialsForm = document.getElementById('credentialsForm');
  const $apiKeyInput = document.getElementById('apiKeyInput');
  const $apiSecretInput = document.getElementById('apiSecretInput');
  const $tokenOnlyInput = document.getElementById('tokenOnlyInput');
  const $credentials = document.getElementById('credentials');
  const $apiKey = document.getElementById('apiKey');
  const $sessionId = document.getElementById('sessionId');
  const $token = document.getElementById('token');
  const $copyApiKey = document.getElementById('copyApiKey');
  const $copySessionId = document.getElementById('copySessionId');
  const $copyToken = document.getElementById('copyToken');

  const generateFromLatest = (e, initialLoad = false) => {
    e && e.preventDefault();
    const credentials = opentok.generateFromMostRecent();
    if (credentials) {
      return displayCredentials(credentials, true);
    }
    if (!initialLoad) {
      alert('No existing credentials available');
    }
  };

  const displayCredentials = ({ apiKey, apiSecret, sessionId, token }, displayKeyAndSecret) => {
    $apiKey.innerText = apiKey;
    $sessionId.innerText = sessionId;
    $token.innerText = token;
    if (displayKeyAndSecret) {
      $apiKeyInput.value = apiKey;
      $apiSecretInput.value = apiSecret;
    }
    $credentials.classList.remove('hidden');
  };

  const generateCredentials = (e) => {
    e.preventDefault();
    const apiKey = $apiKeyInput.value;
    const apiSecret = $apiSecretInput.value;
    const tokenOnly = $tokenOnlyInput.checked;
    if (tokenOnly) {
      displayCredentials(opentok.generateNewToken());
    } else {
      opentok.generateCredentials({ apiKey, apiSecret })
        .then(displayCredentials)
        .catch(error => alert(error));
    }
  };

  const copyToClipboard = (e) => {
    e.preventDefault();
    const id = e.target.id;
    switch (id) {
      case 'copyApiKey':

        copy($apiKey.innerText);
        alert('API Key copied to clipboard.');
        break;
      case 'copySessionId':
        copy($sessionId.innerText);
        alert('Session ID copied to clipboard.');
        break;
      case 'copyToken':
        copy($token.innerText);
        alert('Token copied to clipboard.');
        break;
      default:
        break;
    }
  };

  const setEventListeners = () => {
    $credentialsForm.addEventListener('submit', generateCredentials);
    $copyApiKey.addEventListener('click', copyToClipboard);
    $copySessionId.addEventListener('click', copyToClipboard);
    $copyToken.addEventListener('click', copyToClipboard);
  };

  setEventListeners();
  generateFromLatest(null, true);
};



document.addEventListener('DOMContentLoaded', app);
