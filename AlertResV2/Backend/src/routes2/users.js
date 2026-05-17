// Backend/src/routes2/users.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// TABLA:
/*
CREATE TABLE `users` (
	`user_id` INT(11) NOT NULL AUTO_INCREMENT,
	`person_id` INT(11) NOT NULL,
	`rol` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`search_count` INT(11) NULL DEFAULT '0',
	`last_login` TIMESTAMP NULL DEFAULT current_timestamp(),
	`created_at` TIMESTAMP NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`user_id`) USING BTREE,
	INDEX `person_id` (`person_id`) USING BTREE,
	CONSTRAINT `users_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `people` (`person_id`) ON UPDATE RESTRICT ON DELETE CASCADE
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;
*/

// GET: lista de usuarios con límite opcional
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM users ORDER BY created_at DESC LIMIT ?`
        : `SELECT * FROM users ORDER BY created_at DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});
// GET: seleccionar un usuario en base a su user_id
router.get('/:id', async (req, res) => {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE user_id = ?',
      [req.params.id]
    );
    res.json(rows[0] || null);
});

// GET: seleccionar un usuario en base a su person_id
router.get('/by-person/:id', async (req, res) => {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE person_id = ?',
      [req.params.id]
    );
    res.json(rows[0] || null);
});

// POST: crear un nuevo usuario y devolver la fila insertada
router.post('/', async (req, res) => {
    const {
        person_id,
        rol,
        search_count,
        last_login
    } = req.body;

    if (!person_id) {
        return res.status(400).json({ error: 'person_id es obligatorio' });
    }

    const [result] = await pool.query(
        `INSERT INTO users (
            person_id, rol, search_count, last_login
        ) VALUES (?,?,?,?)`,
        [
            person_id,
            rol ?? null,
            search_count ?? 0,
            last_login ?? null
        ]
    );

    const [rows] = await pool.query(
        `SELECT * FROM users WHERE user_id = ?`,
        [result.insertId]
    );

    res.json(rows[0]);
});

export default router;

// PUT: actualizar un usuario excepto campos protegidos
router.put('/:user_id', async (req, res) => {
    const userId = Number(req.params.user_id);
    // Campos que NO se pueden modificar
    const protectedFields = ['user_id', 'person_id', 'created_at'];
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
        `UPDATE users SET ${fields} WHERE user_id = ?`,
        [...values, userId]
    );

    const [rows] = await pool.query(
        `SELECT * FROM users WHERE user_id = ?`,
        [userId]
    );

    res.json(rows[0]);
});
