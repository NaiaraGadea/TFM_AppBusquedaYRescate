// Backend/src/routes/desaparecidos.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// función auxiliar para calcular edad
function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * POST /desaparecidos
 * Crea un caso mínimo (para la lista) y su ficha detallada en missing_persons.
 */
router.post('/', async (req, res) => {
  const {
    // campos detallados
    first_name,
    last_name,
    date_of_birth,           // 'YYYY-MM-DD'
    sex,                     // 'male' | 'female' | 'other'
    nationality,
    habitual_address,
    disappearance_date,      // 'YYYY-MM-DD'
    disappearance_place,
    disappearance_reason,
    description,
    information,
    disorders_diseases,
    disability,
    treatment,
    addictions,
    gender_violence,         // boolean
    recurrence,              // 'yes' | 'no' | 'unknown'
    status,                  // 'active' | 'found' | 'closed'
    photo_url,
    last_seen_location
  } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'first_name y last_name son obligatorios' });
  }

  const full_name = `${first_name} ${last_name}`;
  const age = calculateAge(date_of_birth);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Insertar en cases (para la lista de inicio)
    const [caseResult] = await conn.query(
      `INSERT INTO cases (full_name, age, description, information, photo_url, last_seen_location, status)
       VALUES (?,?,?,?,?,?,?)`,
      [
        full_name,
        age,
        description ?? null,
        information ?? null,
        photo_url ?? null,
        last_seen_location ?? null,
        status ?? 'active'
      ]
    );
    const caseId = caseResult.insertId;

    // 2) Insertar en missing_persons (ficha detallada)
    const [mpResult] = await conn.query(
      `INSERT INTO missing_persons (
        case_id, first_name, last_name, date_of_birth, sex, nationality, habitual_address,
        disappearance_date, disappearance_place, disappearance_reason,
        description, disorders_diseases, disability, treatment, addictions,
        gender_violence, recurrence, status
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        caseId,
        first_name,
        last_name,
        date_of_birth ?? null,
        sex ?? null,
        nationality ?? null,
        habitual_address ?? null,
        disappearance_date ?? null,
        disappearance_place ?? null,
        disappearance_reason ?? null,
        description ?? null,
        disorders_diseases ?? null,
        disability ?? null,
        treatment ?? null,
        addictions ?? null,
        typeof gender_violence === 'boolean' ? gender_violence : false,
        recurrence ?? 'unknown',
        status ?? 'active'
      ]
    );

    await conn.commit();

    // Devolver ambos registros
    const [[createdCase]] = await conn.query('SELECT * FROM cases WHERE id = ?', [caseId]);
    const [[createdMP]] = await conn.query('SELECT * FROM missing_persons WHERE id = ?', [mpResult.insertId]);

    return res.status(201).json({ case: createdCase, missing_person: createdMP });
  } catch (err) {
    await conn.rollback();
    console.error('POST /desaparecidos error:', err);
    return res.status(500).json({ error: 'Error creando desaparecido' });
  } finally {
    conn.release();
  }
});

/**
 * GET /desaparecidos/:caseId
 * Devuelve la ficha detallada de un caso.
 */
router.get('/:caseId', async (req, res) => {
  const { caseId } = req.params;
  const [rows] = await pool.query(
    `SELECT mp.* FROM missing_persons mp WHERE mp.case_id = ?`,
    [caseId]
  );
  if (!rows.length) return res.status(404).json({ error: 'No encontrado' });
  res.json(rows[0]);
});

/**
 * PATCH /desaparecidos/:caseId/status
 * Actualiza el estado en ambas tablas.
 */
router.patch('/:caseId/status', async (req, res) => {
  const { caseId } = req.params;
  const { status } = req.body;

  if (!['active', 'found', 'closed'].includes(status)) {
    return res.status(400).json({ error: 'status inválido' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query('UPDATE cases SET status = ? WHERE id = ?', [status, caseId]);
    await conn.query('UPDATE missing_persons SET status = ? WHERE case_id = ?', [status, caseId]);

    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    console.error('PATCH /desaparecidos/:caseId/status error:', err);
    res.status(500).json({ error: 'Error actualizando estado' });
  } finally {
    conn.release();
  }
});

export default router;
