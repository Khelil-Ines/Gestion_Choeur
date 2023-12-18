const liste_audition = require("../models/liste_audition");

// const getSaison = (req, res) => {
//     Choriste.find({ saison: req.params.saison })
//       .then((saison) => {
//         if (!saison) {
//           res.status(404).json({
//             message: "saison n'existe pas !",
//           });
//         } else {
//           res.status(200).json({
//             model: task,
//             message: "saison trouvée !",
//           });
//         }
//       })
//       .catch(() => {
//         res.status(400).json({
//           error: Error.message,
//           message: "Données invalides!",
//         });
//       });
//   };

const lancerAudition = (req, res) => {
  const listeAud = new liste_audition(req.body);
  listeAud
    .save()
    .then(() => {
      res.status(201).json({
        model: listeAud,
        message: "audition lancé!",
      });
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

module.exports = { lancerAudition };
