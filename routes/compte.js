const express = require("express");
const router = express.Router();
const Compte = require("../models/compte");
const compteController = require("../controllers/compte");
const auth=require('../middlewares/auth')


/**
 * @swagger
 * tags:
 *  name: Compte
 *  description:  API de gestion des comptes
 */
router.patch("/eliminer_choriste/:id", compteController.EliminerChoriste)

router.get("/",auth.loggedMiddleware, auth.isAdmin ,compteController.getCompte)

router.get("/:id",auth.loggedMiddleware, auth.isAdmin ,compteController.fetchCompte)

router.post("/addcompte/:id",auth.loggedMiddleware, auth.isAdmin ,compteController.addCompte)

router.post("/addadmin/:id",compteController.addCompte)

router.delete("/:id",auth.loggedMiddleware, auth.isAdmin , compteController.deleteCompte)

router.post("/login",compteController.login)

              

  module.exports = router;

/**
 * @swagger
 * /compte/login:
 *   post:
 *     summary: User Authentication.
 *     tags:
 *       - Compte
 *     parameters:
 *       - name: login
 *         in: query
 *         description: Email address or username
 *         required: true
 *         schema:
 *           type: string
 *       - name: motDePasse
 *         in: query
 *         description: User's password
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Authentication successful. Returns an access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Access token generated for the authenticated user
 *       '401':
 *         description: Authentication failed due to incorrect login or password.
 *         content:
 *           application/json:
 *             example:
 *               message: "Incorrect login or password"
 *       '500':
 *         description: Server error during authentication.
 *         content:
 *           application/json:
 *             example:
 *               error: "Server error during authentication"
 */
