const mongoose = require("mongoose");

const besoinChoristeSchema = mongoose.Schema({
  besoinSoprano: { type: Number, required: true},
  besoinAlto: { type: Number, required: true},
  besoinBasse: { type: Number, required: true},
  besoinTenor: { type: Number, required: true}

});

module.exports = mongoose.model("besoinChoriste", besoinChoristeSchema);