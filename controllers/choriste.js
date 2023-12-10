const Choriste = require("../models/choriste");

const fetchChoriste = (req, res) => {
    Choriste.findOne({ _id: req.params.id })
    .populate('pupitre')
    .then((choriste) => {
      if (!choriste) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
          model: choriste,
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

const addChoriste = (req, res) => {
    const newChoriste = new Choriste({
      nom: req.body.nom,
      prenom: req.body.prenom,
      pupitre: req.body.pupitre  // Assurez-vous que pupitre est l'ID du pupitre
    });
  
    newChoriste.save()
      .then(choriste => {
        res.json(choriste);
      })
      .catch(err => {
        res.status(400).json({ erreur: 'Échec de la création du choriste' });
      });
  };
  
  const getChoriste = (req, res) => {
    Choriste.find()
    .populate('auteur')
    .then((choristes) => {res.status(200).json({
          model:choristes,
          message:"success"
            })
            .catch((error) => ({
              error:error.message,
              message:"probleme d'extraction"
            }))
        })
  }

  const getChoristesByPupitre = (req, res) => {
    const pupitreNom = req.body.pupitreNom;
  
    Choriste.find({ pupitre: pupitreNom })
      .then((choristes) => {
        res.status(200).json({
          model: choristes,
          message: "Liste des choristes par pupitre récupérée avec succès!",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error.message,
          message: "Problème d'extraction des choristes par pupitre",
        });
      });
  };


  module.exports = {
    addChoriste,
    getChoriste,
    fetchChoriste,
    getChoristesByPupitre,

  }