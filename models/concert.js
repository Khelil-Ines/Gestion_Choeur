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
  liste_final: { type: [String], default: [] }, // Les absents sont également identifiés par leur nom
  nbr_participant: {
    soprano: { type: Number, default: 0 },
    alto: { type: Number, default: 0 },
    tenor: { type: Number, default: 0 },
    basse: { type: Number, default: 0 },
  },
  seuil_présence: { type: Number },
  //disponible
  liste_Abs: { type: Array, default: [], required: false },

  link: { type: String, required: true },
});
module.exports = Concert;
