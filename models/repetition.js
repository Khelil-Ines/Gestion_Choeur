const mongoose = require("mongoose");

const repetitionSchema = mongoose.Schema({

  date:{type :Date, required:true},
  heureDebut:{type :String, required:true},
  heureFin:{type :String, required:true},
  lieu:{type :String, required:true},
  liste_Presents: { type: Array, required: false },
  liste_Abs: { type: Array, required: false },
  programme : [{ type: mongoose.Schema.Types.ObjectId, ref: 'programme'  }],
  prcPupitre1: { type: Number, required: false },
  prcPupitre2: { type: Number, required: false },
  prcPupitre3: { type: Number, required: false },
  prcPupitre4: { type: Number, required: false },
  link: { type: String, required: true },

  listeSoprano: { type: Array, default: [], required: false },
  listeAlto: { type: Array, default: [], required: false },
  listeTenor: { type: Array, default: [], required: false },
  listeBasse: { type: Array, default: [], required: false },
 


});
module.exports = mongoose.model("Repetition", repetitionSchema);