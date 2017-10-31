const OpenTok = require('opentok');
const storage = require('./storage');

const defaultSessionOptions = { mediaMode: 'routed' };

const createInstance = (apiKey, apiSecret) => new OpenTok(apiKey, apiSecret);

const createToken = (ot, sessionId) => ot.generateToken(sessionId);

const createSession = (credentials = storage.retrieveMostRecentCredentials()) =>
  new Promise((resolve, reject) => {
    const { apiKey, apiSecret } = credentials;
    const ot = createInstance(apiKey, apiSecret);
    ot.createSession(defaultSessionOptions, (err, session) => {
      return err ? reject(err) : resolve(session);
    });
  });

const generateCredentials = (credentials) =>
  new Promise((resolve, reject) => {
    if (!credentials) {
      reject('apiKey and apiSecret are required to generate credentials');
    }
    const { apiKey, apiSecret } = credentials;
    const ot = createInstance(apiKey, apiSecret);
    createSession(credentials);
    ot.createSession(defaultSessionOptions, (err, session) => {
      if (err) {
        return reject(err);
      }
      const token = ot.generateToken(session.sessionId);
      storage.addCredentials({ apiKey, apiSecret, sessionId: session.sessionId });
      resolve({ apiKey, sessionId: session.sessionId, token });
    });
  });

const generateFromMostRecent = () => {
  const credentials = storage.retrieveMostRecentCredentials();
  if (!credentials) {
    return null;
  }
  const { apiKey, apiSecret, sessionId } = credentials;
  const ot = createInstance(apiKey, apiSecret);
  const token = ot.generateToken(sessionId);
  return { apiKey, apiSecret, sessionId, token };
};



module.exports = {
  generateCredentials,
  generateFromMostRecent
};
