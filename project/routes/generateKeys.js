const crypto = require('crypto');

// Generate random secrets
const ACCESS_TOKEN_SECRET = crypto.randomBytes(32).toString('hex');
const REFRESH_TOKEN_SECRET = crypto.randomBytes(32).toString('hex');

// Export secrets
module.exports = { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET };
