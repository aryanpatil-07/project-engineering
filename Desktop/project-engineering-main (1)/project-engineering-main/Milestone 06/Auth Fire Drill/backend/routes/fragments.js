const express = require('express');
const auth = require('../middleware/auth');
const csrfProtection = require('../middleware/csrf');
const { requireRole, requireFragmentOwnershipOrRole } = require('../middleware/roles');
const { fragments } = require('../data/store');

const router = express.Router();

function findFragment(id) {
  return fragments.find((fragment) => fragment.id === Number(id));
}

function decorateFragment(fragment, user) {
  const isOwner = fragment.authorId === user.id;
  const isCurator = user.role === 'Curator' || user.role === 'Admin';
  const isAdmin = user.role === 'Admin';

  return {
    ...fragment,
    isOwner,
    canCreate: ['Contributor', 'Curator', 'Admin'].includes(user.role),
    canEdit: isOwner || isCurator,
    canApprove: isCurator,
    canDelete: isAdmin,
  };
}

router.get('/', auth, (req, res) => {
  return res.json({ fragments: fragments.map((fragment) => decorateFragment(fragment, req.user)) });
});

router.get('/:id', auth, (req, res) => {
  const fragment = findFragment(req.params.id);

  if (!fragment) {
    return res.status(404).json({ error: 'Fragment not found' });
  }

  return res.json({ fragment: decorateFragment(fragment, req.user) });
});

router.post('/', auth, csrfProtection, requireRole('Contributor', 'Curator', 'Admin'), (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  const fragment = {
    id: fragments.length + 1,
    title,
    body,
    authorId: req.user.id,
    authorRole: req.user.role,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  fragments.push(fragment);
  return res.status(201).json({ fragment: decorateFragment(fragment, req.user) });
});

router.put('/:id', auth, csrfProtection, (req, res, next) => {
  const fragment = findFragment(req.params.id);

  if (!fragment) {
    return res.status(404).json({ error: 'Fragment not found' });
  }

  req.fragment = fragment;
  return next();
}, requireFragmentOwnershipOrRole(['Curator', 'Admin']), (req, res) => {
  const { title, body } = req.body;
  const fragment = req.fragment;

  fragment.title = title ?? fragment.title;
  fragment.body = body ?? fragment.body;
  fragment.updatedAt = new Date().toISOString();

  return res.json({ fragment: decorateFragment(fragment, req.user) });
});

router.post('/:id/approve', auth, csrfProtection, requireRole('Curator', 'Admin'), (req, res) => {
  const fragment = findFragment(req.params.id);

  if (!fragment) {
    return res.status(404).json({ error: 'Fragment not found' });
  }

  fragment.status = 'approved';
  fragment.updatedAt = new Date().toISOString();

  return res.json({ fragment: decorateFragment(fragment, req.user) });
});

router.delete('/:id', auth, csrfProtection, requireRole('Admin'), (req, res) => {
  const index = fragments.findIndex((fragment) => fragment.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Fragment not found' });
  }

  const deleted = fragments.splice(index, 1)[0];
  return res.json({ message: 'Fragment deleted', fragment: deleted });
});

module.exports = router;
