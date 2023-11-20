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
  programme : [{ type: mongoose.Schema.Types.ObjectId, ref: 'programme'  }]
});

module.exports = Concert;

