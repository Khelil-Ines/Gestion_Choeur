const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const compteSchema = mongoose.Schema({
  login: { type: String, required: false, unique: false },
  motDePasse: { type: String, required: true },
});

module.exports = mongoose.model("Compte", compteSchema);