const Compte = require('../models/compte');
const Choriste = require('../models/choriste');
const Utilisateur = require('../models/utilisateur');

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

  const deleteCompte = (req, res) => { 
    Compte.deleteOne({_id:req.params.id})
    .then((compte) =>
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


const EliminerChoriste = async (req, res) => {
  try {
    // Find the choriste
    const choriste = await Choriste.findById(req.params.id);
    console.log(choriste._id);
    if (!choriste) {
       res.status(404).json({
        message: "Choriste non trouvé!",
      });
    }else{

    // Get the compte ID associated with the choriste
    const c = choriste.compte;
    console.log(choriste.compte);
    // Delete the compte
    const deletedCompteResult  = await Compte.deleteOne({ _id: c });
    if (deletedCompteResult.deletedCount === 0) {
       res.status(404).json({
        message: "Compte non trouvé!",
      });
    }
    // Update choriste status and historiqueStatut
    choriste.statut = "Eliminé_D";
    choriste.Compte = null;
    choriste.historiqueStatut.push({
      statut: choriste.statut,
      date: new Date()
    });
    // Enregistrer les modifications dans la base de données
    const savedChoriste = await choriste.save();
    Utilisateur.choriste = savedChoriste;
    return res.status(201).json({
      message: "Choriste éliminé pour une raison disciplinaire!"
    });
  }
  } catch (error) {
    console.error("Erreur lors de l'élimination du choriste :", error);
    res.status(500).json({
      error: "Erreur!!",
    });
  }
};



module.exports = {
  addCompteChoriste,
  fetchCompte, 
  getCompte,
  deleteCompte,
  EliminerChoriste
};

