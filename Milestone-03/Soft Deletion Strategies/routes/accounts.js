const express = require('express');
const router = express.Router();
const db = require('../db');
const { serializeAccount } = require('../utils/serializers');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM accounts WHERE tenant_id = $1',
      [req.user.tenant_id]
    );

    res.json(rows.map((row) => serializeAccount(row, req.user)).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: 'Database execution error' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM accounts WHERE tenant_id = $1 AND user_id = $2',
      [req.user.tenant_id, req.params.userId]
    );

    res.json(rows.map((row) => serializeAccount(row, req.user)).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: 'Database retrieval error' });
  }
});

router.post('/', async (req, res) => {
  const { user_id, account_type, balance, billing_card_last4 = null, bank_account = null } = req.body;

  try {
    const { rows } = await db.query(
      `INSERT INTO accounts
       (tenant_id, user_id, account_type, balance, billing_card_last4, bank_account)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.user.tenant_id, user_id, account_type, balance, billing_card_last4, bank_account]
    );

    res.status(201).json(serializeAccount(rows[0], req.user));
  } catch (err) {
    res.status(500).json({ error: 'Account creation failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query(
      'DELETE FROM accounts WHERE tenant_id = $1 AND id = $2',
      [req.user.tenant_id, req.params.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete operation failed' });
  }
});

module.exports = router;