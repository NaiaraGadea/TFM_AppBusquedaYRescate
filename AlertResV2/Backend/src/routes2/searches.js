// Backend/src/routes2/searches.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();
//TABLA:
/*
CREATE TABLE `searches` (
	`search_id` INT(11) NOT NULL AUTO_INCREMENT,
	`case_id` INT(11) NOT NULL,
	`is_public` TINYINT(1) NULL DEFAULT '0',
	`meeting_point` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`meeting_date` DATETIME NULL DEFAULT NULL,
	`message` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`recommendations` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`created_at` TIMESTAMP NULL DEFAULT current_timestamp(),
	`created_by` INT(11) NULL DEFAULT NULL,
	PRIMARY KEY (`search_id`) USING BTREE,
	INDEX `case_id` (`case_id`) USING BTREE,
	INDEX `created_by` (`created_by`) USING BTREE,
	INDEX `idx_searches_meeting_time` (`meeting_date`) USING BTREE,
	CONSTRAINT `searches_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`) ON UPDATE RESTRICT ON DELETE CASCADE,
	CONSTRAINT `searches_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `rescue_groups` (`group_id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;
*/

// GET: lista de búsquedas con límite opcional
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM searches ORDER BY created_at DESC LIMIT ?`
        : `SELECT * FROM searches ORDER BY created_at DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

// GET: búsquedas públicas + búsquedas del grupo
router.get('/by-visibility/:groupId', async (req, res) => {
    const groupId = Number(req.params.groupId);

    // Si no pertenece a ningún grupo solo búsquedas públicas:
    if (isNaN(groupId) || groupId === 0) {
        const [rows] = await pool.query(
            `SELECT * FROM searches WHERE is_public = 1 ORDER BY created_at DESC`
        );
        return res.json(rows);
    }
    // Si sí que pertenece a un grupo
    const [rows] = await pool.query(
        `SELECT * FROM searches 
         WHERE is_public = 1 OR created_by = ?
         ORDER BY created_at DESC`,
        [groupId]
    );

    res.json(rows);
});


// POST: crear una nueva búsqueda y devolver la fila insertada
router.post('/', async (req, res) => {
    const {
        case_id,
        is_public,
        meeting_point,
        meeting_date,
        message,
        recommendations,
        created_by
    } = req.body;

    if (!case_id) {
        return res.status(400).json({ error: 'case_id es obligatorio' });
    }

    const [result] = await pool.query(
        `INSERT INTO searches (
            case_id, is_public, meeting_point, meeting_date,
            message, recommendations, created_by
        ) VALUES (?,?,?,?,?,?,?)`,
        [
            case_id,
            is_public ?? 0,
            meeting_point ?? null,
            meeting_date ?? null,
            message ?? null,
            recommendations ?? null,
            created_by ?? null
        ]
    );

    const [rows] = await pool.query(
        `SELECT * FROM searches WHERE search_id = ?`,
        [result.insertId]
    );

    res.json(rows[0]);
});

// PUT: actualizar una búsqueda completo excepto campos protegidos
router.put('/:search_id', async (req, res) => {
    const searchId = Number(req.params.search_id);

    // Campos que NO se pueden modificar
    const protectedFields = ['search_id', 'case_id', 'meeting_date', 'created_by'];

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
      `UPDATE searches SET ${fields} WHERE search_id = ?`,
      [...values, searchId]
    );

    const [rows] = await pool.query(
      `SELECT * FROM searches WHERE search_id = ?`,
      [searchId]
    );

    res.json(rows[0]);
});


// PUT: actualizar TODAS las búsquedas asociadas a un case_id
router.put('/by-case/:case_id', async (req, res) => {
    const caseId = Number(req.params.case_id);

    // Campos que NO se pueden modificar
    const protectedFields = ['search_id', 'case_id', 'meeting_date', 'created_by'];

    // Filtrar el body
    const updates = Object.fromEntries(
        Object.entries(req.body).filter(([key]) => !protectedFields.includes(key))
    );

    if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No hay campos válidos para actualizar' });
    }

    // Verificar que existen búsquedas para ese case_id
    const [existing] = await pool.query(
        `SELECT search_id FROM searches WHERE case_id = ?`,
        [caseId]
    );

    if (existing.length === 0) {
        return res.status(404).json({ error: 'No existen búsquedas para este case_id' });
    }

    // Construir SQL dinámico
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    const [result] = await pool.query(
        `UPDATE searches SET ${fields} WHERE case_id = ?`,
        [...values, caseId]
    );

    // Obtener las búsquedas actualizadas
    const [rows] = await pool.query(
        `SELECT * FROM searches WHERE case_id = ?`,
        [caseId]
    );

    res.json({
        updated: result.affectedRows,
        searches: rows
    });
});

export default router;
