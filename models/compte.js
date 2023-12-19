const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const compteSchema = mongoose.Schema({
  login: { type: String, required: true, unique: false }, // Assurez-vous que le login est unique
  motDePasse: { type: String, required: true },
});

module.exports = mongoose.model("Compte", compteSchema);