// Backend/src/routes2/group_members.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();
// TABLA
/*
CREATE TABLE `group_members` (
	`group_id` INT(11) NOT NULL,
	`person_id` INT(11) NOT NULL,
	`role_in_group` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`joined_date` DATE NULL DEFAULT curdate(),
	PRIMARY KEY (`group_id`, `person_id`) USING BTREE,
	INDEX `idx_group_members_person` (`person_id`) USING BTREE,
	CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `rescue_groups` (`group_id`) ON UPDATE RESTRICT ON DELETE CASCADE,
	CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`person_id`) REFERENCES `people` (`person_id`) ON UPDATE RESTRICT ON DELETE CASCADE
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;
*/


// GET: lista de group_members con límite opcional
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM group_members ORDER BY joined_date DESC LIMIT ?`
        : `SELECT * FROM group_members ORDER BY joined_date DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

// GET: obtener los miembros de un grupo id
router.get('/by-group/:id', async (req, res) => {
    const [rows] = await pool.query(
      'SELECT * FROM group_members WHERE group_id = ?',
      [req.params.id]
    );
    res.json(rows);
});

// GET: obtener la información de un miembro en base a su person_id
router.get('/by-person/:id', async (req, res) => {
    const [rows] = await pool.query(
      'SELECT * FROM group_members WHERE person_id = ?',
      [req.params.id]
    );
    res.json(rows[0]); // Solo hay 1 persona con ese id.
});

// POST: crear un nuevo miembro de grupo y devolver la fila insertada
router.post('/', async (req, res) => {
    const {
        group_id,
        person_id,
        role_in_group,
        joined_date
    } = req.body;

    if (!group_id || !person_id) {
        return res.status(400).json({ error: 'group_id y person_id son obligatorios' });
    }

    const [result] = await pool.query(
        `INSERT INTO group_members (
            group_id, person_id, role_in_group, joined_date
        ) VALUES (?,?,?,?)`,
        [
            group_id,
            person_id,
            role_in_group ?? null,
            joined_date ?? null
        ]
    );

    // Como la PK es compuesta, buscamos por ambos campos
    const [rows] = await pool.query(
        `SELECT * FROM group_members WHERE group_id = ? AND person_id = ?`,
        [group_id, person_id]
    );

    res.json(rows[0]);
});

export default router;
