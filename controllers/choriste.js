const Choriste = require("../models/choriste");

const fetchChoriste = (req, res) => {
    Choriste.findOne({ _id: req.params.id })
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
  const newChoriste = new Choriste(req.body);
  newChoriste.save()
      .then(choriste => {
          res.json(choriste);
      })
      .catch(err => {
          res.status(400).json({ erreur: 'Échec de la création du l\'choriste' });
      });
}
  
const getChoriste = (req, res) => {
  Choriste.find()
    .then((choristes) => {
      res.status(200).json({
        model: choristes,
        message: "success"
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
        message: "probleme d'extraction"
      });
    });
};


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

  const updatePupitre = async (req, res)=> {
    try {
      const nouveauPupitre = req.body.nouveauPupitre;
  
      // Assurez-vous que le nouveau pupitre est valide
      if (!['Soprano', 'Alto', 'Tenor', 'Basse'].includes(nouveauPupitre)) {
        throw new Error('Tessiture invalide.');
      }
      console.log('ID du choriste à mettre à jour :', req.params.id);
  
      // Récupérez l'instance du choriste à partir de la base de données
      const choriste = await Choriste.findById(req.params.id);
  
      if (!choriste) {
        return res.status(404).json({ message: "Choriste non trouvé." });
      }
  
      // Mettez à jour le pupitre du choriste
      choriste.pupitre = nouveauPupitre;
  
      // Enregistrez les modifications dans la base de données
      await choriste.save();
  
      return res.status(200).json({ choriste, message: 'Tessiture mise à jour avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la modification du pupitre :', error);
      return res.status(500).json({ error: 'Erreur lors de la modification du pupitre.' });
    }
  };
  
  
  



  module.exports = {
    addChoriste,
    getChoriste,
    fetchChoriste,
    getChoristesByPupitre,
    updatePupitre,

  }