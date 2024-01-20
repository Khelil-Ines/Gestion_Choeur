const mongoose = require("mongoose");

const congeSchema = mongoose.Schema({
  date_debut:{type :Date, required:true},
  date_fin:{type :Date, required:true},
  createdAt: {
    type: Date,
    default: Date.now,
  }, });

module.exports = mongoose.model("Conge", congeSchema);