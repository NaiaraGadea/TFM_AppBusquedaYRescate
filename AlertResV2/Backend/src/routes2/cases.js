// Backend/src/routes2/cases.js

import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();
// TABLA:
/*
CREATE TABLE `cases` (
	`case_id` INT(11) NOT NULL AUTO_INCREMENT,
	`missing_id` INT(11) NOT NULL,
	`reporter_id` INT(11) NULL DEFAULT NULL,
	`disappearance_date` DATE NULL DEFAULT NULL,
	`case_status` ENUM('active','closed') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`missing_duration` TIME NULL DEFAULT NULL,
	`departure_point` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`expected_return_point` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`last_seen_point` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`last_seen_at` TIME NULL DEFAULT NULL,
	`last_seen_by` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`last_known_point` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`last_known_at` TIME NULL DEFAULT NULL,
	`typology` ENUM('voluntary','involuntary','forcible') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`category` ENUM('authistic','child 1-3','child 4-6','child 7-9','child 10-12','child 13-15','dementia (alzheimer)','mental illness','intellectual disability','kidnapping','climber','depressed/suicidal','forager','walker/hiker','runner','horse rider','hunter','speleology','fisher','camper','mountain biker','skier/snowboarder','snowmobile','snowshoe','substance abuse','urban entrapment','missing vehicle','atv/ quad','aircraft','water','worker','other') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`recurrence` ENUM('yes','no','unknown') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`created_at` TIMESTAMP NULL DEFAULT current_timestamp(),
	`created_by` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`case_id`) USING BTREE,
	INDEX `missing_id` (`missing_id`) USING BTREE,
	INDEX `reporter_id` (`reporter_id`) USING BTREE,
	INDEX `created_by` (`created_by`) USING BTREE,
	INDEX `idx_cases_reported_at` (`created_at`) USING BTREE,
	CONSTRAINT `cases_ibfk_1` FOREIGN KEY (`missing_id`) REFERENCES `missing_people` (`missing_id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
	CONSTRAINT `cases_ibfk_2` FOREIGN KEY (`reporter_id`) REFERENCES `reporters` (`reporter_id`) ON UPDATE RESTRICT ON DELETE SET NULL,
	CONSTRAINT `cases_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `rescue_groups` (`group_id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;
*/
// GET: lista de casos con límite opcional
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM cases ORDER BY created_at DESC LIMIT ?`
        : `SELECT * FROM cases ORDER BY created_at DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

// GET: lista de casos con alertas públicas con límite opcional
router.get('/activePublicAlerts', async (req, res) => {
    const limit = req.query.limit || null;
    const baseSQL = `SELECT
                    c.case_id,
                    c.disappearance_date,
                    c.last_seen_point,
                    c.created_by,
                    -- alerta pública (siempre será true porque filtramos por casos con alertas públicas)
                    1 AS is_public,
                    p.first_name,
                    p.last_name,
                    p.age,
                    m.photo_url,
                    m.height,
                    m.weight,
                    m.hair,
                    m.facial_hair,
                    m.eye_color,
                    m.physical_constitution,
                    rg.group_name,
                    rg.group_phone,
                    rg.group_email
                    FROM cases c
                    JOIN missing_people m ON m.missing_id = c.missing_id
                    JOIN people p ON p.person_id = m.person_id
                    LEFT JOIN rescue_groups rg ON rg.group_id = c.created_by
                    WHERE c.case_status = 'active' 
                    AND EXISTS (
                            SELECT 1
                            FROM alerts a
                            WHERE a.case_id = c.case_id
                            AND a.is_public = 1
                        )
                    ORDER BY c.created_at DESC
                    `

    const sql = limit ? `${baseSQL} LIMIT ?` : baseSQL;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

// GET: obtener todos los casos de un grupo
router.get('/by-group/:group_id', async (req, res) => {
    const groupId = Number(req.params.group_id);

    const sql = `
      SELECT *
      FROM cases
      WHERE created_by = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.query(sql, [groupId]);
    res.json(rows);
});

// GET: Obtención de los casos en base al estado del caso
router.get('/by-status', async (req, res) => {
    const status = req.query.status || null; // si no viene, será null

    const sql = `
      SELECT *
      FROM cases
      WHERE (? IS NULL OR case_status = ?)
      ORDER BY created_at DESC
    `;

    const params = [status, status];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

// GET: obtener un caso por su id
router.get('/:id', async (req, res) => {
    const [rows] = await pool.query(
      'SELECT * FROM cases WHERE case_id = ?',
      [req.params.id]
    );
    res.json(rows[0] || null);
});



// POST: crear un nuevo caso y devolver la fila insertada
router.post('/', async (req, res) => {
    const {
        missing_id,
        reporter_id,
        disappearance_date,
        case_status,
        missing_duration,
        departure_point,
        expected_return_point,
        last_seen_point,
        last_seen_at,
        last_seen_by,
        last_known_point,
        last_known_at,
        typology,
        category,
        recurrence,
        created_by
    } = req.body;

    if (!missing_id) {
        return res.status(400).json({ error: 'missing_id es obligatorio' });
    }

    const [result] = await pool.query(
        `INSERT INTO cases (
            missing_id, reporter_id, disappearance_date, case_status,
            missing_duration, departure_point, expected_return_point,
            last_seen_point, last_seen_at, last_seen_by,
            last_known_point, last_known_at, typology,
            category, recurrence, created_by
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            missing_id,
            reporter_id ?? null,
            disappearance_date ?? null,
            case_status ?? null,
            missing_duration ?? null,
            departure_point ?? null,
            expected_return_point ?? null,
            last_seen_point ?? null,
            last_seen_at ?? null,
            last_seen_by ?? null,
            last_known_point ?? null,
            last_known_at ?? null,
            typology ?? null,
            category ?? null,
            recurrence ?? null,
            created_by ?? null
        ]
    );

    const [rows] = await pool.query(
        `SELECT * FROM cases WHERE case_id = ?`,
        [result.insertId]
    );

    res.json(rows[0]);
});

// PUT: actualizar un caso completo excepto campos protegidos
router.put('/:case_id', async (req, res) => {
    const caseId = Number(req.params.case_id);

    // Campos que NO se pueden modificar
    const protectedFields = ['case_id', 'missing_id', 'reporter_id', 'created_at', 'created_by'];

    // Filtrar el body para evitar que actualicen campos protegidos
    const updates = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => !protectedFields.includes(key))
    );

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No hay campos válidos para actualizar' });
    }

    // Construir SQL dinámico
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    await pool.query(
      `UPDATE cases SET ${fields} WHERE case_id = ?`,
      [...values, caseId]
    );

    const [rows] = await pool.query(
      `SELECT * FROM cases WHERE case_id = ?`,
      [caseId]
    );

    res.json(rows[0]);
});


export default router;
