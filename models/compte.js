const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const compteSchema = mongoose.Schema({
  login: { type: String, required: true, unique: true }, // Assurez-vous que le login est unique
  motDePasse: { type: String, required: true },
});

// Utilisez la fonction 'pre' pour hacher le mot de passe avant de sauvegarder
// compteSchema.pre('save', async function (next) {
//   const compte = this;

//   if (compte.isModified('motDePasse') || compte.isNew) {
//     try {
//       const hash = await bcrypt.hash(compte.motDePasse, 10);
//       compte.motDePasse = hash;
//       next();
//     } catch (error) {
//       return next(error);
//     }
//   } else {
//     return next();
//   }
// });

module.exports = mongoose.model("Compte", compteSchema);