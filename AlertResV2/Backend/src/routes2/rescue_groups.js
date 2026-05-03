// Backend/src/routes2/rescue_groups.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

//TABLA:
/*
CREATE TABLE `rescue_groups` (
	`group_id` INT(11) NOT NULL AUTO_INCREMENT,
	`group_name` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`base_address` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`group_email` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`group_phone` VARCHAR(30) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`group_type` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`created_at` TIMESTAMP NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`group_id`) USING BTREE
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;
*/

// GET: lista de rescue_groups con límite opcional
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM rescue_groups ORDER BY created_at DESC LIMIT ?`
        : `SELECT * FROM rescue_groups ORDER BY created_at DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});
// GET: obtener grupo(s) al que pertenece una persona
router.get('/groupByPerson/:person_id', async (req, res) => {
    const personId = Number(req.params.person_id);

    const sql = `
      SELECT 
        rg.group_id,
        rg.group_name,
        rg.group_phone,
        rg.group_email,
        gm.role_in_group,
        gm.joined_date
      FROM group_members gm
      JOIN rescue_groups rg ON rg.group_id = gm.group_id
      WHERE gm.person_id = ?
    `;

    const [rows] = await pool.query(sql, [personId]);
    res.json(rows[0]);
});
// GET: seleccionar un grupo en base a su group_id
router.get('/:id', async (req, res) => {
    const [rows] = await pool.query(
      'SELECT * FROM rescue_groups WHERE group_id = ?',
      [req.params.id]
    );
    res.json(rows[0] || null);
});


// POST: crear un nuevo rescue_group y devolver la fila insertada
router.post('/', async (req, res) => {
    const {
        group_name,
        base_address,
        group_email,
        group_phone,
        group_type
    } = req.body;

    const [result] = await pool.query(
        `INSERT INTO rescue_groups (
            group_name, base_address, group_email, group_phone, group_type
        ) VALUES (?,?,?,?,?)`,
        [
            group_name ?? null,
            base_address ?? null,
            group_email ?? null,
            group_phone ?? null,
            group_type ?? null
        ]
    );

    const [rows] = await pool.query(
        `SELECT * FROM rescue_groups WHERE group_id = ?`,
        [result.insertId]
    );

    res.json(rows[0]);
});

export default router;
