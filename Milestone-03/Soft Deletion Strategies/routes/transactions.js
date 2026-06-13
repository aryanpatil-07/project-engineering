const express = require('express');
const router = express.Router();
const db = require('../db');
const { serializeTransaction } = require('../utils/serializers');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM transactions WHERE tenant_id = $1',
      [req.user.tenant_id]
    );

    res.json(rows.map((row) => serializeTransaction(row, req.user)).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: 'Database execution error' });
  }
});

router.get('/account/:accountId', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM transactions WHERE tenant_id = $1 AND account_id = $2',
      [req.user.tenant_id, req.params.accountId]
    );

    res.json(rows.map((row) => serializeTransaction(row, req.user)).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: 'Database retrieval error' });
  }
});

router.post('/', async (req, res) => {
  const { account_id, amount, type, description } = req.body;

  try {
    const { rows } = await db.query(
      `INSERT INTO transactions (tenant_id, account_id, amount, type, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.tenant_id, account_id, amount, type, description]
    );

    res.status(201).json(serializeTransaction(rows[0], req.user));
  } catch (err) {
    res.status(500).json({ error: 'Transaction record creation failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query(
      'DELETE FROM transactions WHERE tenant_id = $1 AND id = $2',
      [req.user.tenant_id, req.params.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete operation failed' });
  }
});

module.exports = router;