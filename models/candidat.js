const mongoose = require("mongoose");
const moment = require("moment");

const utilisateur = require("./utilisateur");

const CandidatSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prénom: { type: String, required: true },
  email: { type: String, required: true , unique:true },
  connaissance_musicale: { type: String },
  autres_activites: { type: Boolean},
  Taille: { type: Number },
  confirmation: { type: Boolean, default: false},
  createdAt: { type: Date, default: () => moment().toDate() },
});

module.exports = utilisateur.discriminator("Candidat", CandidatSchema);
