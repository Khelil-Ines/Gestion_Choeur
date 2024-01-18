const mongoose = require("mongoose");

const repetitionSchema = mongoose.Schema({

  date:{type :Date, required:true},
  heureDebut:{type :String, required:true},
  heureFin:{type :String, required:true},
  lieu:{type :String, required:true},
  liste_Presents: { type: Array, default: [], required: false },
  liste_Abs: { type: Array, default: [], required: false },

  prcSoprano: { type: Number, required: false },
  prcAlto: { type: Number, required: false },
  prcTenor: { type: Number, required: false },
  prcBasse: { type: Number, required: false },
  link: { type: String, required: true },

  listeSoprano: { type: Array, default: [], required: false },
  listeAlto: { type: Array, default: [], required: false },
  listeTenor: { type: Array, default: [], required: false },
  listeBasse: { type: Array, default: [], required: false },
  programme : [{ type: mongoose.Schema.Types.ObjectId, ref: 'programme'  }]


});
module.exports = mongoose.model("Repetition", repetitionSchema);