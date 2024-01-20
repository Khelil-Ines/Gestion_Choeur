const mongoose = require("mongoose");

const compositeurSchema = mongoose.Schema({
  nom: { type: String, required: true , unique : true },
  prenom: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Compositeur", compositeurSchema);
