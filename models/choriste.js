const mongoose = require("mongoose");
const ChoristeSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  pupitre :{type : String, enum: ['Soprano','Alto','Basse','Tenor'], required: true},
  confirmationStatus: { type: String, default: 'En attente de confirmation' },
  oneTimeToken : { type: String},
});

module.exports = mongoose.model("Choriste", ChoristeSchema);