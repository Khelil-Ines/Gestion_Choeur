const router = require("express").Router();
const multer = require("multer");
const programmeController = require("../controllers/programme.js");
const upload = multer({ storage: multer.memoryStorage() }); 


/**
 * @swagger
 * tags:
 *  name: Programme
 *  description:  API de gestion des programmes
 */

/**
 * @swagger
 * /programme:
 *   get:
 *     summary: Get all programmes
 *     tags:
 *       - Programme
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: All programmes retrieved successfully
 *               programmes:
 *                 - _id: "programme_id_1"
 *                   theme: "Programme Theme 1"
 *                   oeuvre: ["oeuvre_id_1", "oeuvre_id_2"]
 *                 - _id: "programme_id_2"
 *                   theme: "Programme Theme 2"
 *                   oeuvre: ["oeuvre_id_3", "oeuvre_id_4"]
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.get("/", programmeController.getProgrammes);

/**
 * @swagger
 * /programme/add:
 *   post:
 *     summary: Add a new programme
 *     tags:
 *       - Programme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProgramme'
 *     responses:
 *       201:
 *         description: Programme added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Programme added!
 *               programme:
 *                 _id: "new_programme_id"
 *                 theme: "New Programme Theme"
 *                 oeuvre: ["id_oeuvre1", "id_oeuvre2"]
 *       400:
 *         description: Bad request. You may need to verify your information.
 *         content:
 *           application/json:
 *             example:
 *               error: Bad Request
 *               message: Invalid data provided
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 *
 * components:
 *   schemas:
 *     NewProgramme:
 *       type: object
 *       properties:
 *         theme:
 *           type: string
 *           description: The theme of the new programme
 *         oeuvre:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of oeuvre IDs associated with the programme
 */

router.post("/add", programmeController.addProgramme);

/**
 * @swagger
 * /programme/ajouterProgrammeFile:
 *   post:
 *     summary: Add programmes and oeuvres from an Excel file
 *     tags:
 *       - Programme
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fichierExcel:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Programmes and Oeuvres created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Programmes and Oeuvres created from the Excel file
 *               programmes: [{ _id: "programme_id", theme: "Programme Theme", oeuvre: [] }]
 *               oeuvres: [{ _id: "oeuvre_id", titre: "Oeuvre Title", choral: "Choral" }]
 *       '400':
 *         description: Bad request. You may need to verify your information.
 *         content:
 *           application/json:
 *             example:
 *               error: Bad Request
 *               message: Invalid data provided
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 *               message: An unexpected error occurred
 */

router.post('/ajouterProgrammeFile', upload.single('fichierExcel'), programmeController.addProgrammewithFile);
   
  


module.exports = router;
