// Modèle Concert
const mongoose = require('mongoose');

const ConcertSchema = mongoose.Schema({
  date: { type: Date },
  lieu: { type: String, required: true },
  saison: { type: String, required: true }, // Ajoutez ce champ pour suivre la saison
  liste_Presents: { type: Array, default: [], required: false },
  liste_Abs: { type: Array, default: [], required: false },
  link: { type: String, required: true },
  programme : [{ type: mongoose.Schema.Types.ObjectId, ref: 'programme'  }]
});

module.exports = mongoose.model('Concert', ConcertSchema);
