const mongoose = require("mongoose");


const compteSchema = mongoose.Schema({
  login: { type: String, required: true, unique: true }, // Assurez-vous que le login est unique
  motDePasse: { type: String, required: true },
});

module.exports = mongoose.model("Compte", compteSchema);