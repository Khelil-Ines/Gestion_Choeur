const Repetition = require("../models/repetition");
const Choriste = require("../models/choriste");
const crypto = require('crypto');

const addRepetition = async (req, res) => {
  try {
    const randomLink = crypto.randomBytes(5).toString('hex');
    const newRepetition = new Repetition({
      ...req.body,
      link: randomLink,
    });

    // Sauvegarder la nouvelle répétition
    const repetition = await newRepetition.save();

    // Récupérer tous les IDs des choristes (supposons que le modèle Choriste a un champ _id)
    const choristes = await Choriste.find({}, '_id');

    // Ajouter les IDs des choristes à la liste d'absence de la nouvelle répétition
    repetition.liste_Abs = choristes.map(choriste => choriste._id);

    // Sauvegarder à nouveau la répétition mise à jour
    await repetition.save();

    res.json(repetition);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la répétition :', error);
    res.status(400).json({ erreur: 'Échec de la création de la répétition' });
  }
};





module.exports = {
  addRepetition,
};
