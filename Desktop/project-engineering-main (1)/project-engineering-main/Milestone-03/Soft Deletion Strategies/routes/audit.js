const express = require('express');
const router = express.Router();
const db = require('../db');

// GET deleted records for audit/admin review
router.get('/deleted-records', async (req, res) => {
  try {
    const [users, accounts, transactions] = await Promise.all([
      db.query('SELECT * FROM users WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC, id DESC'),
      db.query('SELECT * FROM accounts WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC, id DESC'),
      db.query('SELECT * FROM transactions WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC, id DESC')
    ]);

    res.json({
      users: users.rows,
      accounts: accounts.rows,
      transactions: transactions.rows,
    });
  } catch (err) {
    res.status(500).json({ error: 'Audit retrieval failed' });
  }
});

module.exports = router;