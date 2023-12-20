const Repetition = require("../models/repetition");
const crypto = require('crypto');

const addRepetition = async (req, res) => {
  try {
    const randomLink = crypto.randomBytes(5).toString('hex');
    const newRepetition = new Repetition({
      ...req.body,
      link: randomLink,
    });

    const repetition = await newRepetition.save();

    res.json(repetition);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la répétition :', error);
    res.status(400).json({ erreur: 'Échec de la création de la répétition' });
  }
};




module.exports = {
  addRepetition,
};
