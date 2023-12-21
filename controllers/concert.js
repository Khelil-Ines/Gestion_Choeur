const Concert = require("../models/concert.js");
const crypto = require('crypto');

const addConcert = async (req, res) => {
    try {
      const randomLink = crypto.randomBytes(5).toString('hex');
      const newConcert = new Concert({
        ...req.body,
        link: randomLink,
      });
      // Sauvegarder à nouveau la répétition mise à jour
      await newConcert.save();
  
      res.json(newConcert);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du concert :', error);
      res.status(400).json({ erreur: 'Échec de la création du concert' });
    }
  };



module.exports = {
  addConcert,
};
