const express = require('express');
const router = express.Router();
const db = require('../db');
const { serializeUser } = require('../utils/serializers');

router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM users WHERE tenant_id = $1';
    const params = [req.user.tenant_id];

    if (req.user.role === 'manager') {
      query += ' AND manager_id = $2';
      params.push(req.user.id);
    }

    if (req.user.role === 'user') {
      query += ' AND id = $2';
      params.push(req.user.id);
    }

    const { rows } = await db.query(query, params);
    res.json(rows.map((row) => serializeUser(row, req.user)).filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: 'Database execution error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM users WHERE tenant_id = $1 AND id = $2',
      [req.user.tenant_id, req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const safe = serializeUser(rows[0], req.user);
    if (!safe) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(safe);
  } catch (err) {
    res.status(500).json({ error: 'Database retrieval error' });
  }
});

router.post('/', async (req, res) => {
  const { name, email, role = 'user', manager_id = null, salary = null, ssn = null } = req.body;

  try {
    const { rows } = await db.query(
      `INSERT INTO users (tenant_id, name, email, role, manager_id, salary, ssn)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.tenant_id, name, email, role, manager_id, salary, ssn]
    );

    res.status(201).json(serializeUser(rows[0], req.user));
  } catch (err) {
    res.status(500).json({ error: 'User creation failed' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query(
      'DELETE FROM users WHERE tenant_id = $1 AND id = $2',
      [req.user.tenant_id, req.params.id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete operation failed' });
  }
});

module.exports = router;