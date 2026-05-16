function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return next();
  };
}

function requireFragmentOwnershipOrRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.fragment) {
      return res.status(404).json({ error: 'Fragment not found' });
    }

    if (allowedRoles.includes(req.user.role) || req.fragment.authorId === req.user.id) {
      return next();
    }

    return res.status(403).json({ error: 'You can only edit your own fragment' });
  };
}

module.exports = { requireRole, requireFragmentOwnershipOrRole };
