const mongoose = require("mongoose");

const Concert = mongoose.model("concert", {
  // affiche (optionnel)
  date: {
    type: Date,
    //required: true
  },
  lieu: {
    type: String,
    required: true,
  },
  programme: [{ type: mongoose.Schema.Types.ObjectId, ref: "programme" }],
  liste_Presents: { type: Array, default: [], required: false },
  liste_final: { type: Array, default: [], required: false },
  participant_par_pupitre: {
    Soprano: { type: Array, default: [] },
    Alto: { type: Array, default: [] },
    Tenor: { type: Array, default: [] },
    Basse: { type: Array, default: [] },
  },
  seuil_présence: { type: Number },
  //disponible
  liste_Abs: { type: Array, default: [], required: false },

  link: { type: String, required: true },
});
module.exports = Concert;
