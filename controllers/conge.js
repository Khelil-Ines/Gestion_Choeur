const Choriste = require('../models/choriste');
const Conge = require('../models/conge');

const addConge = async (req, res) => {
  try {
    const choristeId = req.params.id;
    const { date_debut, date_fin } = req.body;

    // Vérifiez si le choriste existe
    const choriste = await Choriste.findById(choristeId);
    if (!choriste) {
      return res.status(404).json({ message: 'Choriste non trouvé.' });
    }

    // Créez un nouveau congé
    const newConge = new Conge({ date_debut, date_fin });
    
    // Enregistrez le congé dans la base de données
    const savedConge = await newConge.save();

    // Ajoutez l'ID du congé au tableau des congés du choriste
    choriste.conges.push(savedConge._id);
    
    // Enregistre la mise à jour du choriste dans la base de données
    await choriste.save();

    res.status(201).json({ choriste, conge: savedConge });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du congé :', error);
    res.status(500).json({ error: 'Échec de la création du congé.' });
  }
};

module.exports = {
  addConge,
};

