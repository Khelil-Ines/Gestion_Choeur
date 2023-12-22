const mongoose = require("mongoose");

const compositeurSchema = mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
});

module.exports = mongoose.model("Compositeur", compositeurSchema);
