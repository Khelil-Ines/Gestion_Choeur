const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pupitreSchema = new Schema({
  num: {
    type: Number,
    enum: [1, 2, 3, 4]
  },
});

module.exports = Pupitre = mongoose.model("Pupitre", pupitreSchema);