const mongoose = require("mongoose");
const moment = require('moment');

const utilisateur = require("./utilisateur");

const CandidatSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prénom: { type: String, required: true },
  email: { type: String, required: true },
  connaissance_musicale: { type: String, required: true },
  autres_activites: { type: Boolean, required: true },
  Taille: { type: Number, required: true },
  confirmation: { type: Boolean},
  createdAt: { type: Date, default: () => moment().toDate() },
});

module.exports = utilisateur.discriminator("Candidat", CandidatSchema);

