const mongoose = require("mongoose");

const oeuvreSchema = mongoose.Schema({
  title: { type: String, required: true },
  Compositeur: [{ type: mongoose.Schema.Types.ObjectId, ref: "Compositeur", required: true }],
  arrangeurs: [{ type: String, required: true }],
  genre: { type: Array, required: true },
  anneeComposition: { type: Number, required: true},
  partition: { type: String, required: false },
  paroles: { type: String, required: false },
  presenceChoeur: { type: Boolean, required: true },

});


module.exports = mongoose.model("Oeuvre", oeuvreSchema);

