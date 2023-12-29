const mongoose = require("mongoose");

const repetitionSchema = mongoose.Schema({

  date:{type :Date, required:true},
  heureDebut:{type :String, required:true},
  heureFin:{type :String, required:true},
  lieu:{type :String, required:true},
<<<<<<< HEAD
  liste_Presents: { type: Array, required: false },
  liste_Abs: { type: Array, required: false },
  programme : [{ type: mongoose.Schema.Types.ObjectId, ref: 'programme'  }],
  prcPupitre1: { type: Number, required: false },
  prcPupitre2: { type: Number, required: false },
  prcPupitre3: { type: Number, required: false },
  prcPupitre4: { type: Number, required: false },
=======
  liste_Presents: { type: Array, default: [], required: false },
  liste_Abs: { type: Array, default: [], required: false },

  prcSoprano: { type: Number, required: false },
  prcAlto: { type: Number, required: false },
  prcTenor: { type: Number, required: false },
  prcBasse: { type: Number, required: false },
>>>>>>> 076445a637e667dc1a1f4c7e56fc1e10223a8df6
  link: { type: String, required: true },

  listeSoprano: { type: Array, default: [], required: false },
  listeAlto: { type: Array, default: [], required: false },
  listeTenor: { type: Array, default: [], required: false },
  listeBasse: { type: Array, default: [], required: false },


});
module.exports = mongoose.model("Repetition", repetitionSchema);