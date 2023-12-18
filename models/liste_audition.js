const mongoose = require("mongoose");

const ListeAuditionSchema = mongoose.Schema({
  Date: String,
  Durée: String,
  Lieu: String,
});
module.exports = mongoose.model("listeAudition", ListeAuditionSchema);
