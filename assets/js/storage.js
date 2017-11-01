const Store = require('electron-store');
const store = new Store();

const addCredentials = (apiKeyAndSecret) => {
  const apiKey = apiKeyAndSecret.apiKey;
  const existing = store.get('credentials', {});
  const newCredentials = { [apiKey]: Object.assign({}, apiKeyAndSecret, { timestamp: Date.now() }) };
  store.set('credentials', Object.assign({}, existing, newCredentials));
};

const retrieveMostRecentCredentials = () => {
  const existing = store.get('credentials', {});
  return Object.values(existing).sort((a, b) => a.timestamp < b.timestamp)[0];
};

const retrieveCredentialsForApiKey = apiKey => {
  const existing = store.get('credentials', {});
  return existing[apiKey];
};

module.exports = {
  addCredentials,
  retrieveMostRecentCredentials,
  retrieveCredentialsForApiKey
};