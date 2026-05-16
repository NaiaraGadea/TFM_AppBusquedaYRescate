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

export default router;
