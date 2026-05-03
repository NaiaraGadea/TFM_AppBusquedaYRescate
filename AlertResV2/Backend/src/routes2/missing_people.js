// Backend/src/routes2/missing_people.js
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();
//TABLA:
/*
CREATE TABLE `missing_people` (
	`missing_id` INT(11) NOT NULL AUTO_INCREMENT,
	`person_id` INT(11) NOT NULL,
	`nickname` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`adult` TINYINT(1) NULL DEFAULT NULL,
	`sex` ENUM('female','male','other') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`nationality` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`languages` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`habitual_address` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`photo_url` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`height` FLOAT NULL DEFAULT NULL,
	`weight` FLOAT NULL DEFAULT NULL,
	`hair` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`facial_hair` ENUM('beard','mustache','goatee','none') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`eye_color` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`last_clothing` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`physical_level` ENUM('sedentary','active','athlete') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`physical_constitution` ENUM('slim','average','sotcky') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`other_physical_features` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`medical_conditions` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`allergies` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`disability` ENUM('psychiatric','physical','sensory','intellectual','none') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`lack_of_autonomy` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`treatment` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`with_medication` TINYINT(1) NULL DEFAULT '0',
	`substance_abuse` ENUM('drugs','alcohol','prescription drugs','other') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`visual_problems` ENUM('glasses','contact lenses','colorblind','other') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`hearing_problems` ENUM('hearing aid','cochlear implant','other') NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`grade_of_deafness` VARCHAR(200) NULL DEFAULT NULL COLLATE 'utf8mb4_uca1400_ai_ci',
	`gender_violence` TINYINT(1) NULL DEFAULT '0',
	`created_at` TIMESTAMP NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`missing_id`) USING BTREE,
	INDEX `person_id` (`person_id`) USING BTREE,
	CONSTRAINT `missing_people_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `people` (`person_id`) ON UPDATE RESTRICT ON DELETE RESTRICT
)
COLLATE='utf8mb4_uca1400_ai_ci'
ENGINE=InnoDB
;
*/

// GET: lista de missing_people con límite opcional
router.get('/', async (req, res) => {
    const limit = req.query.limit || null;

    const sql = limit
        ? `SELECT * FROM missing_people ORDER BY created_at DESC LIMIT ?`
        : `SELECT * FROM missing_people ORDER BY created_at DESC`;

    const params = limit ? [Number(limit)] : [];

    const [rows] = await pool.query(sql, params);
    res.json(rows);
});
// GET: seleccionar una persona desaparecida en base a su missing_id
router.get('/:id', async (req, res) => {
    const [rows] = await pool.query(
      'SELECT * FROM missing_people WHERE missing_id = ?',
      [req.params.id]
    );
    res.json(rows[0] || null);
});

// POST: crear un nuevo missing_person y devolver la fila insertada
router.post('/', async (req, res) => {
    const {
        person_id,
        nickname,
        adult,
        sex,
        nationality,
        languages,
        habitual_address,
        photo_url,
        height,
        weight,
        hair,
        facial_hair,
        eye_color,
        last_clothing,
        physical_level,
        physical_constitution,
        other_physical_features,
        medical_conditions,
        allergies,
        disability,
        lack_of_autonomy,
        treatment,
        with_medication,
        substance_abuse,
        visual_problems,
        hearing_problems,
        grade_of_deafness,
        gender_violence
    } = req.body;

    if (!person_id) {
        return res.status(400).json({ error: 'person_id es obligatorio' });
    }

    const [result] = await pool.query(
        `INSERT INTO missing_people (
            person_id, nickname, adult, sex, nationality, languages,
            habitual_address, photo_url, height, weight, hair, facial_hair,
            eye_color, last_clothing, physical_level, physical_constitution,
            other_physical_features, medical_conditions, allergies, disability,
            lack_of_autonomy, treatment, with_medication, substance_abuse,
            visual_problems, hearing_problems, grade_of_deafness, gender_violence
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            person_id,
            nickname ?? null,
            adult ?? null,
            sex ?? null,
            nationality ?? null,
            languages ?? null,
            habitual_address ?? null,
            photo_url ?? null,
            height ?? null,
            weight ?? null,
            hair ?? null,
            facial_hair ?? null,
            eye_color ?? null,
            last_clothing ?? null,
            physical_level ?? null,
            physical_constitution ?? null,
            other_physical_features ?? null,
            medical_conditions ?? null,
            allergies ?? null,
            disability ?? null,
            lack_of_autonomy ?? null,
            treatment ?? null,
            with_medication ?? 0,
            substance_abuse ?? null,
            visual_problems ?? null,
            hearing_problems ?? null,
            grade_of_deafness ?? null,
            gender_violence ?? 0
        ]
    );

    const [rows] = await pool.query(
        `SELECT * FROM missing_people WHERE missing_id = ?`,
        [result.insertId]
    );

    res.json(rows[0]);
});

export default router;
