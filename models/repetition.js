const mongoose = require("mongoose");

const repetitionSchema = mongoose.Schema({
  date:{type :Date, required:false},
  heureDebut:{type :String, required:true},
  heureFin:{type :String, required:true},
  lieu:{type :String, required:true},
  liste_Presents: { type: Array, default: [], required: false },
  liste_Abs: { type: Array, default: [], required: false },
  prcPupitre1: { type: Number, required: false },
  prcPupitre2: { type: Number, required: false },
  prcPupitre3: { type: Number, required: false },
  prcPupitre4: { type: Number, required: false },
  link: { type: String, required: true },

});
module.exports = mongoose.model("Repetition", repetitionSchema);