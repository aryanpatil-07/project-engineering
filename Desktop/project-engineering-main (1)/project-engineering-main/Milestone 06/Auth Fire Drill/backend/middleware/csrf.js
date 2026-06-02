const { getCsrfToken } = require('../auth/jwt');

function csrfProtection(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const headerToken = req.headers['x-csrf-token'];
  const jwtToken = (req.headers.authorization || '').split(' ')[1];
  const expectedToken = jwtToken ? getCsrfToken(jwtToken) : undefined;

  if (!headerToken || !expectedToken || headerToken !== expectedToken) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }

  return next();
}

module.exports = csrfProtection;
