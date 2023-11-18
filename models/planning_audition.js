const mongoose = require("mongoose");

const planningSchema = mongoose.Schema({
  date_audition : { type: Date, required: true },
  id_candidat: { type: String}
});
module.exports = mongoose.model("planning", planningSchema);
