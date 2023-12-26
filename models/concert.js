const mongoose = require('mongoose');

const Concert = mongoose.model('concert', {
    // affiche (optionnel) 
  date: {
    type: Date,
    required: true
  },
  lieu: {
    type: String,
    required: true
  },
  programme : [{ type: mongoose.Schema.Types.ObjectId, ref: 'programme'  }],
  liste_Presents: { type: Array, default: [], required: false },

  //disponible
  liste_Abs: { type: Array, default: [], required: false },

  link: { type: String, required: true },

  placements: {
    soprano: [[Object]],
    alto: [[Object]],
    tenor: [[Object]],
    basse: [[Object]],
  },
})
module.exports = Concert;