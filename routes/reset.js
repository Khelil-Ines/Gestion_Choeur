const express = require("express");
const router = express.Router();
const utilisateurs = require("../models/utilisateur");
const absences = require("../models/absence");
const candidatures = require("../models/candidature");
const compositeurs = require("../models/Compositeur");
const comptes = require("../models/compte");
const concerts = require("../models/concert");
const oeuvres = require("../models/oeuvre");
const programmes = require("../models/programme");
const conges = require("../models/conge");
const notifications = require("../models/notification");
const repetitions = require("../models/repetition");
const auditions = require("../models/audition");
const candidats = require("../models/candidat");
const choristes = require("../models/choriste");

router.delete("/", async (req, res) => {
  try {
    await utilisateurs.deleteMany({});
    await absences.deleteMany({});
    await candidatures.deleteMany({});
    await compositeurs.deleteMany({});
    await comptes.deleteMany({});
    await concerts.deleteMany({});
    await oeuvres.deleteMany({});
    await programmes.deleteMany({});
    await conges.deleteMany({});
    await notifications.deleteMany({});
    await repetitions.deleteMany({});
    await auditions.deleteMany({});


    const candidatJson = require("../candidat.json");

    // Insert the accounts from the JSON file
    await candidats.insertMany(candidatJson);

    res
      .status(200)
      .json({ message: "Base de données réinitialisée avec succès." });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation de la base de données :",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la réinitialisation de la base de données.",
    });
  }
});

module.exports = router;