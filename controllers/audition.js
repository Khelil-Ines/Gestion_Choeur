
const Audition = require("../models/audition");


// Fonction pour créer des auditions à partir du planning
// async function refresh_audition (req, res){
//     try {
//         const plannings = await Planning.find();
    
//         const auditions = plannings.map(planning => ({
//           id_candidat: planning.id_candidat,
//           date_audition: planning.date_audition,
//         }));
    
//         const createdAuditions = await Audition.insertMany(auditions);
    
//         res.status(201).json({
//           model: createdAuditions,
//           message: 'Auditions created successfully!',
//         });
    
//         console.log('Auditions created successfully from planning.');
//       } catch (error) {
//         console.error('Error creating auditions:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
//     }
   
  
const addAuditionbyAdmin = (req, res) => {
  Audition.create(req.body)
    .then((audition) => {
      res.status(201).json({
        model: audition,
        message: "Audition creé!",
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

const fetchAuditions = (req, res) => {
  Audition.find()
    .then((auditions) => {
      res.status(200).json(auditions);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};


const updateAudition = (req, res) => {
  Audition.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    { new: true }
  )
    .then((audition) => {
      if (!audition) {
        res.status(404).json({
          message: "Audition non trouvé",
        });
      } else {
        res.status(200).json({
          model: audition,
          message: "Audition modifié",
        });
      }
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

const deleteAudition = (req, res) => {
  Audition.deleteOne({ _id: req.params.id })
    .then((audition) => {
      if (!audition) {
        res.status(404).json({
          message: "Audition non supprimée!",
        });
      } else {
        res.status(200).json({
          model: audition,
          message: "Audition supprimée!",
        });
      }
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

module.exports = {
    // refresh_audition,
  addAuditionbyAdmin,
  fetchAuditions,
  updateAudition,
  deleteAudition,
};

