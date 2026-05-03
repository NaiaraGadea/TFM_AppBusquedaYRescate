import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /alerts
router.get('/', async (req, res) => {
  const limit = Number(req.query.limit || 50);
  const [rows] = await pool.query(
    `SELECT a.id, a.message, a.is_public, a.alert_type, a.zone, a.created_at,
            c.id AS case_id, c.full_name, c.photo_url, c.last_seen_location
     FROM alerts a
     JOIN cases c ON a.case_id = c.id
     ORDER BY a.created_at DESC
     LIMIT ?`,
    [limit]
  );
  res.json(rows);
});

// POST /alerts
router.post('/', async (req, res) => {
  const { case_id, message, is_public, alert_type, zone } = req.body;
  if (!case_id || !alert_type) {
    return res.status(400).json({ error: 'case_id y alert_type son obligatorios' });
  }

  const [result] = await pool.query(
    `INSERT INTO alerts (case_id, message, is_public, alert_type, zone)
     VALUES (?, ?, ?, ?, ?)`,
    [case_id, message, is_public ?? true, alert_type, zone || null]
  );

  const [rows] = await pool.query('SELECT * FROM alerts WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
});

export default router;
