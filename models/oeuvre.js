const mongoose = require('mongoose');

const Oeuvre = mongoose.model('oeuvre', {
    // affiche (optionnel) 
 
  choral: {
    type: Boolean,
    required: true
  },
});

module.exports = Oeuvre;

