// Backend/src/routes2/reporters.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// TABLA:
/*
CREATE TABLE `reporters` (
	`reporter_id` INT(11) NOT NULL AUTO_INCREMENT,
	`person_id` INT(11) NOT NULL,
	`relation` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`report_reason` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	PRIMARY KEY (`reporter_id`) USING BTREE,
	INDEX `person_id` (`person_id`) USING BTREE,
	CONSTRAINT `reporters_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `people` (`person_id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;
*/

// GET: lista de reporters con límite opcional
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM reporters ORDER BY reporter_id DESC LIMIT ?`
        : `SELECT * FROM reporters ORDER BY reporter_id DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

// POST: crear un nuevo reporter y devolver la fila insertada
router.post('/', async (req, res) => {
    const {
        person_id,
        relation,
        report_reason
    } = req.body;

    if (!person_id) {
        return res.status(400).json({ error: 'person_id es obligatorio' });
    }

    const [result] = await pool.query(
        `INSERT INTO reporters (
            person_id, relation, report_reason
        ) VALUES (?,?,?)`,
        [
            person_id,
            relation ?? null,
            report_reason ?? null
        ]
    );

    const [rows] = await pool.query(
        `SELECT * FROM reporters WHERE reporter_id = ?`,
        [result.insertId]
    );

    res.json(rows[0]);
});

export default router;
