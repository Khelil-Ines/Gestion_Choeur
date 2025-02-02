const mongoose = require("mongoose");
const utilisateur = require("./utilisateur");

const historiqueStatutSchema = mongoose.Schema({
  statut: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const presenceManuelleSchema = mongoose.Schema({
  date: { type: Date, default: Date.now },
  raison: { type: String, required: false },
  type: { type: String ,  required: false },

});

const choristeSchema = mongoose.Schema({
  pupitre: {
    type: String,
    enum: ['Soprano', 'Alto', 'Basse', 'Tenor'],
    required: true,
  },
  statut: {
    type: String,
    enum: ['Actif', 'En_Congé','Nominé', 'Eliminé', "Eliminé_Discipline"],
    default: 'Actif',
  },
  niveau: {
    type: String,
    enum: ['Junior', 'Choriste', 'Sénior', 'Vétéran'],
    default: 'Junior',
  },
  Taille : {type : Number, required: true},
  date_adhesion: { type: Date },
  historiqueStatut: [historiqueStatutSchema],
  nbr_concerts: { type: Number , default: 0 },
  nbr_repetitions: { type: Number , default: 0  },
  nbr_absences: { type: Number, default: 0 },
  absences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Absence', required: false }],
  conges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conge',
    required: false,
  }],
  confirmationStatus: { type: String, default: 'En attente de confirmation' },
  oneTimeToken: { type: String },
  concertsParticipes: [{
    concertId: { type: mongoose.Schema.Types.ObjectId, ref: 'Concert' },
    date: { type: Date },
    lieu: { type: String },
  }],
  presencesManuelles: [presenceManuelleSchema],
});

// Méthode pour incrémenter le nombre de répétitions
choristeSchema.methods.incrementRepetitions = function () {
  this.nbr_repetitions += 1;
  return this.save();
};

// Méthode pour incrémenter le nombre de concerts
choristeSchema.methods.incrementConcerts = function () {
  this.nbr_concerts += 1;
  return this.save();
};

module.exports = utilisateur.discriminator('Choriste', choristeSchema);
