const mongoose = require("mongoose");


const oeuvreSchema = mongoose.Schema({
  title: { type: String, required: true },
  Compositeur: [{ type: mongoose.Schema.Types.ObjectId, ref: "Compositeur" }],
  arrangeurs: [{ type: String, required: true }],
  genre: { type: Array, required: true },
  anneeComposition: { type: Number},
  partition: { type: String },
  paroles: { type: String },
  choral: { type: Boolean, required: true },

});

module.exports = mongoose.model("Oeuvre", oeuvreSchema);
