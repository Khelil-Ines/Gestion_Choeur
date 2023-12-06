const Repetition = require("../models/repetition");

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

const addRepetition = (req, res) => { 
    const newRepetition = new Repetition(req.body);
    newRepetition.save()
        .then(repetition => {
            res.json(repetition);
        })
        .catch(err => {
            res.status(400).json({ erreur: 'Échec de la création du l\'repetition' });
        });
  }
  const getRepetition = (req, res) => {
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

// const getRepetitionsJour = (req, res) => {
//     const jour = req.params.jour; // Utilisez la valeur directement sans conversion en minuscules
  
//     // Vérifiez que la date est valide
//     if (!['Accepté', 'Refusé', 'En Attente'].includes(jour)) {
//       return res.status(400).json({
//         message: "date invalide. Utilisez la forme JJ/MM/AA '.",
//       });
//     }
  
//     // Utilisez le modèle Audition pour trouver toutes les auditions avec le résultat spécifié
//     Repetition.find({ date: jour })
//       .then((repetitions) => {
//         res.status(200).json({
//           model: repetitions,
//           message: `Planning du jour '${jour}'`,
//         });
//       })
//       .catch((error) => {
//         res.status(500).json({
//           error: error.message,
//           message: `Erreur lors de la récupération des repetitions le jour '${jour}'`,
//         });
//       });
//   };


  
  module.exports = {
    addRepetition,
    getRepetition,
    fetchRepetition,
    updateRepetition,
    deleteRepetition 
    //getRepetitionsJour
  }