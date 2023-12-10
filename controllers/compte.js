const Compte = require('../models/compte');
const bcrypt = require('bcrypt');

const creerCompteChoriste = async (email) => {
  try {
    // Générer un mot de passe aléatoire
    const motDePasseAleatoire = genererMotDePasseAleatoire();

    if (typeof motDePasseAleatoire !== 'string') {
      throw new Error('La fonction genererMotDePasseAleatoire doit retourner une chaîne de caractères.');
    }
    
    // Hasher le mot de passe
    const motDePasseHash = await hashMotDePasse(motDePasseAleatoire);

    // Créer le compte
    const nouveauCompte = new Compte({
      login: email,
      motDePasse: motDePasseHash,
    });

    // Sauvegarder le compte dans la base de données
    const compte = await nouveauCompte.save();

    return compte;
  } catch (error) {
    console.error('Erreur lors de la création du compte choriste :', error);
    throw error;
  }
};

async function genererMotDePasseAleatoire(longueur) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const longueurMotDePasse = longueur || 12;

  let motDePasse = '';
  for (let i = 0; i < longueurMotDePasse; i++) {
    const caractereAleatoire = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    motDePasse += caractereAleatoire;
  }

  return motDePasse;
}

const coutHachage = 10;
async function hashMotDePasse(motDePasse) {
  return await bcrypt.hash(motDePasse, coutHachage);
}

module.exports = {
  creerCompteChoriste,
};

