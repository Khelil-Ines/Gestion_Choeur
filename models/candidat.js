const mongoose = require("mongoose");
const sexe = ["Homme", "Femme"];
const CandidatSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: Number, required: true },
  CIN: { type: Number, required: true },
  address: { type: String, required: true },
  mail: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  status: { type: String, required: true },
  sexe: { type: String, required: true, enum: sexe },
  musicalKnowledge: { type: String, required: true },
  otherActivitie: { type: Boolean, required: true },
  Raison: { type: String, required: false },
  Taille: { type: Number, required: true },
});

module.exports = mongoose.model("Candidat", CandidatSchema);
