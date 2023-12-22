const mongoose = require('mongoose');

const Programme = mongoose.model('programme', {

    // affiche (optionnel) 

 
  theme: {
    type: String,
    required: true
  },
  oeuvre : [{ type: mongoose.Schema.Types.ObjectId, ref: 'oeuvre'  }]
});


module.exports = Programme;

