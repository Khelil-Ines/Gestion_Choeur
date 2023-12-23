const Repetition = require("../models/repetition");
const Choriste = require("../models/choriste");
const crypto = require('crypto');
const moment = require("moment");

const fetchRepetition = (req, res) => {
    Repetition.findOne({ _id: req.params.id })
    .then((repetition) => {
      if (!repetition) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
          model: repetition,
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



  const updateRepetition = (req, res) => {
    Repetition.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(
        (repetition) => {
          if (!repetition) {
            res.status(404).json({
              message: "objet non trouvé!",
            });
          } else {
            res.status(200).json({
              model: repetition,
              message: "objet modifié!",
            });
          }
        }
      )
}

const deleteRepetition = (req, res) => { 
    Repetition.deleteOne({_id:req.params.id})
    .then((repetitions) =>
      res.status(200).json({
        message: "success!",
      })
    )

    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "probleme d'extraction ",
      });
    });
}
const getPlanning = (req, res) => {
  Repetition.find().then((repetitions) => {
    res.status(200).json({
      model: repetitions,
      message: "success"
    });
  })
  .catch((error) => {
    res.status(500).json({
      error: error.message,
      message: "problème d'extraction"
    });
  });
}

const getPlanningByDate = async (req, res) => {
  try {

      const dateParam = req.body.date;
  
      // Vérifier le format de la date (JJ-MM-AA)
      const isValidDate = moment(dateParam, "YYYY-MM-DD", true).isValid();
      if (!isValidDate) {
        return res.status(400).json({
          message: "Format de date invalide. Utilisez le format AAAA-MM-JJ.",
        });
      }
    const dateRepetition = new Date(dateParam);

    // Récupérez les répétitions pour la date spécifiée
    const repetitions = await Repetition.find({ date: dateRepetition });

    res.status(200).json({
      model: repetitions,
      message: `Liste des répétitions pour le ${dateRepetition.toDateString()} récupérée avec succès!`,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Problème d'extraction des répétitions pour la date spécifiée",
    });
  }
};
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
    fetchRepetition,
    updateRepetition,
    deleteRepetition, 
    getPlanningByDate,
    getPlanning,
  }







