const Candidat = require("../models/candidat");


const fetchCandidat = (req, res) => {
    Candidat.findOne({ _id: req.params.id })
    .then((candidat) => {
      if (!candidat) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
          model: candidat,
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

const addCandidat = (req, res) => { 
    const newCandidat = new Candidat(req.body);
    newCandidat.save()
        .then(candidat => {
            res.json(candidat);
        })
        .catch(err => {
            res.status(400).json({ erreur: 'Échec de la création du l\'candidat' });
        });
  }
  const getCandidat = (req, res) => {
    Candidat.find().then((candidats) => {
      res.status(200).json({
        model: candidats,
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

  const updateCandidat = (req, res) => {
    Candidat.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(
        (candidat) => {
          if (!candidat) {
            res.status(404).json({
              message: "objet non trouvé!",
            });
          } else {
            res.status(200).json({
              model: candidat,
              message: "objet modifié!",
            });
          }
        }
      )
}

const getCandidatsByPupitre = (req, res) => {
  const pupitreNom = req.body.pupitreNom;

  Candidat.find({ pupitre: pupitreNom })
    .then((candidats) => {
      res.status(200).json({
        model: candidats,
        message: "Liste des candidats par pupitre récupérée avec succès!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
        message: "Problème d'extraction des candidats par pupitre",
      });
    });
};


  
  module.exports = {
    addCandidat,
    getCandidat,
    fetchCandidat,
    updateCandidat,
    getCandidatsByPupitre
    }