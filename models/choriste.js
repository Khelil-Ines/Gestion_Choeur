const mongoose = require("mongoose");
const ChoristeSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Choriste", ChoristeSchema);