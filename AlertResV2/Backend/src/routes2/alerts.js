// Backend/src/routes2/alerts.js
import {Router} from 'express';
import {pool} from '../db.js';

const router = Router();

// TABLA:
/* 
CREATE TABLE `alerts` (
	`alert_id` INT(11) NOT NULL AUTO_INCREMENT,
	`case_id` INT(11) NOT NULL,
	`message` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`is_public` TINYINT(1) NULL DEFAULT '0',
	`alert_type` ENUM('mayor','menor','vulnerable','normal') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`alert_zone` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`created_at` TIMESTAMP NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`alert_id`) USING BTREE,
	INDEX `case_id` (`case_id`) USING BTREE,
	INDEX `idx_alerts_zone` (`alert_zone`(768)) USING BTREE,
	CONSTRAINT `alerts_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`) ON UPDATE RESTRICT ON DELETE CASCADE
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;*/

// Endpoint GET: lista de alertas con límite de filas, que por defecto no existe.
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM alerts ORDER BY created_at DESC LIMIT ?`
        : `SELECT * FROM alerts ORDER BY created_at DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

// GET: alertas públicas + alertas del grupo
router.get('/by-visibility/:groupId', async (req, res) => {
	const groupId = Number(req.params.groupId);

	// Si no pertenece a ningún grupo solo búsquedas públicas:
	if (isNaN(groupId) || groupId === 0) {
		const [rows] = await pool.query(
			`SELECT * FROM alerts WHERE is_public = 1 ORDER BY created_at DESC`
		);
		return res.json(rows);
	}
	// Si sí que pertenece a un grupo
	const [rows] = await pool.query(
		`SELECT a.*
		FROM alerts a
		JOIN cases c ON c.case_id = a.case_id
		WHERE a.is_public = 1
			OR c.created_by = ?
		ORDER BY a.created_at DESC`,
		[groupId]
	);

	res.json(rows);
});

// Enpoint POST: creación de una nueva alerta en la tabla alerts y devuelve la fila insertada. 
// Primero se extraen las variables enviadas en el request, después se insertan. 
// Luego se devuelve los datos de la nueva fila añadida.
// Aquí la ruta es '/'

router.post('/', async(req,res)=>{
	const {case_id, message, is_public, alert_type, alert_zone} = req.body;

	if (!case_id){
		return res.status(400).json({error: 'case_id son obligatorios'});
	}

	const [result] = await pool.query(
		`INSERT INTO alerts (case_id, message, is_public, alert_type, alert_zone)
        VALUES (?,?,?,?,?)`, [case_id, message, is_public ?? false, alert_type ?? 'normal', alert_zone ?? null]);

	const [rows] = await pool.query(`SELECT * FROM alerts WHERE alert_id=?`, [result.insertId]);

	res.json(rows[0])

});

// Se exporta el router
export default router; 
