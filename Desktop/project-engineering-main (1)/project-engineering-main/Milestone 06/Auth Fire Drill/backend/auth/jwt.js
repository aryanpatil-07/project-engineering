const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

const tokenBlacklist = new Set();
const csrfTokensByJwt = new Map();

function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function issueCsrfToken(jwtToken) {
  const csrfToken = crypto.randomBytes(24).toString('hex');
  csrfTokensByJwt.set(jwtToken, csrfToken);
  return csrfToken;
}

function getCsrfToken(jwtToken) {
  return csrfTokensByJwt.get(jwtToken);
}

function revokeToken(jwtToken) {
  tokenBlacklist.add(jwtToken);
  csrfTokensByJwt.delete(jwtToken);
}

function isBlacklisted(jwtToken) {
  return tokenBlacklist.has(jwtToken);
}

module.exports = {
  signToken,
  verifyToken,
  issueCsrfToken,
  getCsrfToken,
  revokeToken,
  isBlacklisted,
};
