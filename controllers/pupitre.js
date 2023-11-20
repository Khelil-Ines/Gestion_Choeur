const Pupitre = require("../models/pupitre");

const fetchPupitre = (req, res) => {
    Pupitre.findOne({ _id: req.params.id })
    .then((pupitre) => {
      if (!pupitre) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
          model: pupitre,
          message: "objet trouvé!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
}

const addPupitre = (req, res) => { 
    const newPupitre = new Pupitre(req.body);
    newPupitre.save()
        .then(pupitre => {
            res.json(pupitre);
        })
        .catch(err => {
            res.status(400).json({ erreur: 'Échec de la création du l\'pupitre' });
        });
  }
  const getPupitre = (req, res) => {
    Pupitre.find().then((pupitres) => {
      res.status(200).json({
        model: pupitres,
        message: "success"
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
        message: "problème d'extraction"
      });
    });
  };

  
  module.exports = {
    addPupitre,
    getPupitre,
    fetchPupitre
  }