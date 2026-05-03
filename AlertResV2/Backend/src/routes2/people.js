// Backend/src/routes2/people.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// TABLA:
/*
CREATE TABLE `people` (
	`person_id` INT(11) NOT NULL AUTO_INCREMENT,
	`first_name` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`last_name` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`dni` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`birth_date` DATE NULL DEFAULT NULL,
	`age` INT(11) NULL DEFAULT NULL,
	`phone` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`email` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`created_at` TIMESTAMP NULL DEFAULT current_timestamp(),
	`updated_at` TIMESTAMP NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`person_id`) USING BTREE,
	UNIQUE INDEX `dni` (`dni`) USING BTREE
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;
*/

// GET: lista de personas con límite opcional
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM people ORDER BY created_at DESC LIMIT ?`
        : `SELECT * FROM people ORDER BY created_at DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});
// GET: seleccionar una persona en base a su person_id
router.get('/:id', async (req, res) => {
    const [rows] = await pool.query(
      'SELECT * FROM people WHERE person_id = ?',
      [req.params.id]
    );
    res.json(rows[0] || null);
});


// POST: crear una nueva persona y devolver la fila insertada
router.post('/', async (req, res) => {
    const {
        first_name,
        last_name,
        dni,
        birth_date,
        age,
        phone,
        email
    } = req.body;

    if (!first_name || !last_name) {
        return res.status(400).json({ error: 'first_name y last_name son obligatorios' });
    }

    const [result] = await pool.query(
        `INSERT INTO people (
            first_name, last_name, dni, birth_date, age, phone, email
        ) VALUES (?,?,?,?,?,?,?)`,
        [
            first_name,
            last_name,
            dni ?? null,
            birth_date ?? null,
            age ?? null,
            phone ?? null,
            email ?? null
        ]
    );

    const [rows] = await pool.query(
        `SELECT * FROM people WHERE person_id = ?`,
        [result.insertId]
    );

    res.json(rows[0]);
});

export default router;

