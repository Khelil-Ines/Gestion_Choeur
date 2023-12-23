const mongoose = require("mongoose");
const moment = require('moment');
const utilisateur = require("./utilisateur");
<<<<<<< HEAD

const CandidatSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
=======
const CandidatSchema = mongoose.Schema({
>>>>>>> c12b5b3d2125d83db676d5dbf22aaa4617d8c57e
  connaissance_musicale: { type: String, required: true },
  autres_activites: { type: Boolean, required: true },
  Taille: { type: Number, required: true },
  confirmation: { type: Boolean},
  createdAt: { type: Date, default: () => moment().toDate() },
});

module.exports = utilisateur.discriminator("Candidat", CandidatSchema);

