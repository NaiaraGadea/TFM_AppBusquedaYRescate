// Backend/src/routes/searchs.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

/**
 * POST /searchs
 * Crea una nueva búsqueda asociada a un caso.
 */
router.post('/', async (req, res) => {
  const { case_id, meeting_place, meeting_date, message, recommendations, is_public } = req.body;

  if (!case_id || !meeting_place) {
    return res.status(400).json({ error: 'case_id y meeting_place son obligatorios' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO searchs (case_id, meeting_place, meeting_date, message, recommendations, is_public)
       VALUES (?,?,?,?,?,?)`,
      [
        case_id,
        meeting_place,
        meeting_date ?? null,
        message ?? null,
        recommendations ?? null,
        typeof is_public === 'boolean' ? is_public : true
      ]
    );

    const [[created]] = await pool.query('SELECT * FROM searchs WHERE id = ?', [result.insertId]);
    return res.status(201).json(created);
  } catch (err) {
    console.error('POST /searchs error:', err);
    return res.status(500).json({ error: 'Error creando búsqueda' });
  }
});

/**
 * GET /searchs
 * Lista todas las búsquedas (con límite opcional).
 */
router.get('/', async (req, res) => {
  const limit = Number(req.query.limit) || 50;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM searchs ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /searchs error:', err);
    res.status(500).json({ error: 'Error obteniendo búsquedas' });
  }
});

/**
 * GET /searchs/case/:caseId
 * Lista todas las búsquedas de un caso concreto.
 */
router.get('/case/:caseId', async (req, res) => {
  const { caseId } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM searchs WHERE case_id = ? ORDER BY created_at DESC',
      [caseId]
    );
    res.json(rows);
  } catch (err) {
    console.error('GET /searchs/case/:caseId error:', err);
    res.status(500).json({ error: 'Error obteniendo búsquedas del caso' });
  }
});

/**
 * GET /searchs/:id
 * Devuelve una búsqueda por su id.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM searchs WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Búsqueda no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET /searchs/:id error:', err);
    res.status(500).json({ error: 'Error obteniendo búsqueda' });
  }
});

/**
 * DELETE /searchs/:id
 * Elimina una búsqueda por id.
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM searchs WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('DELETE /searchs/:id error:', err);
    res.status(500).json({ error: 'Error eliminando búsqueda' });
  }
});

export default router;
