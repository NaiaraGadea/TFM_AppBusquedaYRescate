// Backend/src/routes2/search_participants.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// TABLA:
/*
CREATE TABLE `search_participants` (
	`search_id` INT(11) NOT NULL,
	`person_id` INT(11) NOT NULL,
	`comments` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`joined_at` TIMESTAMP NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`search_id`, `person_id`) USING BTREE,
	INDEX `person_id` (`person_id`) USING BTREE,
	INDEX `idx_search_participants_person` (`person_id`) USING BTREE,
	CONSTRAINT `search_participans_ibfk_1` FOREIGN KEY (`search_id`) REFERENCES `searches` (`search_id`) ON UPDATE RESTRICT ON DELETE CASCADE,
	CONSTRAINT `search_participans_ibfk_2` FOREIGN KEY (`person_id`) REFERENCES `people` (`person_id`) ON UPDATE RESTRICT ON DELETE CASCADE
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;
*/

// GET: lista de participantes con límite opcional
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM search_participants ORDER BY joined_at DESC LIMIT ?`
        : `SELECT * FROM search_participants ORDER BY joined_at DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

// POST: crear un nuevo participante y devolver la fila insertada
router.post('/', async (req, res) => {
    const {
        search_id,
        person_id,
        comments
    } = req.body;

    if (!search_id || !person_id) {
        return res.status(400).json({ error: 'search_id y person_id son obligatorios' });
    }

    const [result] = await pool.query(
        `INSERT INTO search_participants (
            search_id, person_id, comments
        ) VALUES (?,?,?)`,
        [
            search_id,
            person_id,
            comments ?? null
        ]
    );

    // Como la PK es compuesta, buscamos por ambos campos
    const [rows] = await pool.query(
        `SELECT * FROM search_participants WHERE search_id = ? AND person_id = ?`,
        [search_id, person_id]
    );

    res.json(rows[0]);
});

export default router;
