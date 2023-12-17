const mongoose = require('mongoose');

const Oeuvre = mongoose.model('oeuvre', {
    // affiche (optionnel) 
 titre : { type : String, required : true},
  choral: {
    type: Boolean,
    required: true
  },
});


module.exports = Oeuvre;




