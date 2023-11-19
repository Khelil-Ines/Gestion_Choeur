const mongoose = require("mongoose");

const oeuvreSchema = mongoose.Schema({
  title: { type: String, required: true },
  compositeurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Compositeur", required: true }],
  arrangeurs: [{ type: String, required: true }],
  genre: { type: Array, required: true },
  anneeComposition: { type: Number, required: true},
  partition: { type: String, required: false },
  paroles: { type: String, required: false },
  presenceChoeur: { type: Boolean, required: true },
  parties: [
    {
      numero: { type: Number, required: true },
      nom: { type: String, required: true },
      partieChoeur: { type: Boolean, required: false },
      pupitres: [{ type: String, required: false }],
    },
  ],
});

module.exports = mongoose.model("Oeuvre", oeuvreSchema);
