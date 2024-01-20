const mongoose = require("mongoose");

const CandidatureSchema = mongoose.Schema({
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date },
  nbJours: { type: Number, required: true },
});

CandidatureSchema.pre("save", function (next) {
  if (this.dateDebut && this.nbJours) {
    const dateFin = new Date(this.dateDebut);
    dateFin.setDate(dateFin.getDate() + this.nbJours);
    this.dateFin = dateFin;
  }
  next();
});

CandidatureSchema.pre("findOneAndUpdate", function (next) {
  if (this.dateDebut && this.nbJours) {
    const dateFin = new Date(this.dateDebut);
    dateFin.setDate(dateFin.getDate() + this.nbJours);
    this.dateFin = dateFin;
  }
  next();
});

module.exports = mongoose.model("Candidature", CandidatureSchema);
