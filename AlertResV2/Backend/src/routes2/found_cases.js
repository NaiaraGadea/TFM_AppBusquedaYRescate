// Backend/src/routes2/found_cases.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// TABLA:
/*
CREATE TABLE `found_cases` (
	`found_id` INT(11) NOT NULL AUTO_INCREMENT,
	`case_id` INT(11) NOT NULL,
	`found_location` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`latitude` DECIMAL(9,6) NULL DEFAULT NULL,
	`longitude` DECIMAL(9,6) NULL DEFAULT NULL,
	`distance_from_ipp_km` FLOAT NULL DEFAULT NULL,
	`vertical_elevation_m` INT(11) NULL DEFAULT NULL,
	`mobility_hours` FLOAT NULL DEFAULT NULL,
	`localization_type` ENUM('structures','roads','tracks','drainages','water_areas','brush/scrub','woods','fields','rocky_areas') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`scenario` ENUM('avalanche','criminal','despondent','evading','investigative','lost','medical','drowning','delay','stranded','trapped','trauma') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`subject_status` ENUM('healthy','minor_injury','serious_injury','deceased') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`climate_type` ENUM('temperate','dry') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`disappearance_zone` ENUM('natural_or_rural','urban_areas') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`disappearance_terrain` ENUM('mountain','flat') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`final_notes` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`found_at` TIMESTAMP NULL DEFAULT NULL,
	`recorded_at` TIMESTAMP NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`found_id`) USING BTREE,
	INDEX `case_id` (`case_id`) USING BTREE,
	CONSTRAINT `found_cases_ibfk_1` FOREIGN KEY (`case_id`) REFERENCES `cases` (`case_id`) ON UPDATE RESTRICT ON DELETE CASCADE
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;
*/

// GET: lista de found_cases con límite opcional
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM found_cases ORDER BY recorded_at DESC LIMIT ?`
        : `SELECT * FROM found_cases ORDER BY recorded_at DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});

// POST: crear un nuevo found_case y devolver la fila insertada
router.post('/', async (req, res) => {
    const {
        case_id,
        found_location,
        latitude,
        longitude,
        distance_from_ipp_km,
        vertical_elevation_m,
        mobility_hours,
        localization_type,
        scenario,
        subject_status,
        climate_type,
        disappearance_zone,
        disappearance_terrain,
        final_notes,
        found_at
    } = req.body;

    if (!case_id) {
        return res.status(400).json({ error: 'case_id es obligatorio' });
    }

    const [result] = await pool.query(
        `INSERT INTO found_cases (
            case_id, found_location, latitude, longitude,
            distance_from_ipp_km, vertical_elevation_m, mobility_hours,
            localization_type, scenario, subject_status,
            climate_type, disappearance_zone, disappearance_terrain,
            final_notes, found_at
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            case_id,
            found_location ?? null,
            latitude ?? null,
            longitude ?? null,
            distance_from_ipp_km ?? null,
            vertical_elevation_m ?? null,
            mobility_hours ?? null,
            localization_type ?? null,
            scenario ?? null,
            subject_status ?? null,
            climate_type ?? null,
            disappearance_zone ?? null,
            disappearance_terrain ?? null,
            final_notes ?? null,
            found_at ?? null
        ]
    );

    const [rows] = await pool.query(
        `SELECT * FROM found_cases WHERE found_id = ?`,
        [result.insertId]
    );

    res.json(rows[0]);
});

export default router;
