const express = require('express');
const { users } = require('../data/store');
const { signToken, issueCsrfToken, revokeToken } = require('../auth/jwt');
const auth = require('../middleware/auth');
const csrfProtection = require('../middleware/csrf');

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((entry) => entry.email === email && entry.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user);
  const csrfToken = issueCsrfToken(token);

  return res.json({
    token,
    csrfToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }

  if (users.some((entry) => entry.email === email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    name,
    role: 'Reader',
  };

  users.push(newUser);

  const token = signToken(newUser);
  const csrfToken = issueCsrfToken(token);

  return res.status(201).json({
    token,
    csrfToken,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
  });
});

router.post('/logout', auth, csrfProtection, (req, res) => {
  revokeToken(req.user.token);
  return res.json({ message: 'Logged out' });
});

router.get('/me', auth, (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
