const Compte = require('../models/compte');

const addCompteChoriste = (req, res) => {
    const newCompte = new Compte(req.body);
    newCompte.save()
        .then(compte => {
            res.json(compte);
        })
        .catch(err => {
            res.status(400).json({ erreur: 'Échec de la création du l\'compte' });
        });
  }

  const fetchCompte = (req, res) => {
    Compte.findOne({ _id: req.params.id })
    .then((compte) => {
      if (!compte) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
          model: compte,
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

  const getCompte = (req, res) => {
    Compte.find().then((comptes) => {
      res.status(200).json({
        model: comptes,
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
  addCompteChoriste,
  fetchCompte, 
  getCompte
};

