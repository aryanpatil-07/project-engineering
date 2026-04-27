module.exports = function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!req.user.tenant_id || !req.user.role) {
    return res.status(400).json({ error: 'Missing tenant or role context' });
  }

  next();
};