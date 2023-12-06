const Compte = require('../models/compte');
const Candidat = require('../models/candidat');
const Choriste = require('../models/choriste');
const bcrypt = require('bcrypt');

const createCompte = async (candidat) => {
  try {
    // Créer un compte associé au candidat
    const nouveauCompte = new Compte({
      login: candidat.email,
      motDePasse: await hashMotDePasse(genererMotDePasseAleatoire()),
    });

    const compte = await nouveauCompte.save();

    // Associer l'ID du compte au candidat
    candidat.compte = compte._id;
    await candidat.save();

    // Convertir le candidat en choriste
    const nouveauChoriste = new Choriste({
      nom: candidat.nom,
      prenom: candidat.prenom,
      pupitre: candidat.pupitre,
      compte: compte._id,
    });

    await nouveauChoriste.save();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCompte,
};

