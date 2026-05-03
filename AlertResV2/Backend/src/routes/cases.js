// Backend/src/routes/cases.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET /cases - lista de desaparecidos
router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, full_name, age, description, information, photo_url, last_seen_location, status, created_at 
     FROM cases 
     WHERE status = "active" 
     ORDER BY created_at DESC`
  );
  res.json(rows);
});

// GET/cases/with-alerts - lista de desaparecidos con alertas activas.
router.get('/with-alerts', async (req, res) => {
  const [rows] = await pool.query(`
    SELECT DISTINCT c.*
    FROM cases c
    JOIN alerts a ON a.case_id = c.id
    WHERE c.status = 'active'
    ORDER BY c.created_at DESC
  `);
  res.json(rows);
});

// GET /cases/all - lista de todos los casos
router.get('/all', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, full_name, age, description, information, photo_url, last_seen_location, status, created_at 
     FROM cases 
     ORDER BY created_at DESC`
  );
  res.json(rows);
});

// GET /cases/:id - obtener un caso concreto
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query('SELECT * FROM cases WHERE id = ?', [id]);
  if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
  res.json(rows[0]);
});


// POST /cases - registrar un caso nuevo
router.post('/', async (req, res) => {
  const { full_name, age, description, information, photo_url, last_seen_location } = req.body;
  if (!full_name) return res.status(400).json({ error: 'full_name es obligatorio' });

  const [result] = await pool.query(
    `INSERT INTO cases (full_name, age, description, information, photo_url, last_seen_location) 
     VALUES (?,?,?,?,?,?)`,
    [full_name, age || null, description || null, information || null, photo_url || null, last_seen_location || null]
  );

  const [rows] = await pool.query('SELECT * FROM cases WHERE id = ?', [result.insertId]);
  res.status(201).json(rows[0]);
});

// PATCH /cases/:id/status - actualizar estado
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'active' | 'found' | 'closed'
  if (!['active', 'found', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'status inválido' });
  }
  await pool.query('UPDATE cases SET status = ? WHERE id = ?', [status, id]);
  res.json({ ok: true });
});

export default router;
