const Choriste = require("../models/choriste");


exports.consulterDetailsProfil = async (req, res) => {
    try {
        const choriste = await Choriste.findById(req.params.id);
        if (!choriste) {
            return res.status(404).json({ message: 'Choriste non trouvé' });
        }

        const estAdmin = req.user.role === 'admin'; 

        if (estAdmin || req.user.id === choriste.id) {
            res.json({
                id: choriste.id,
                nom: choriste.nom,
                prenom: choriste.prenom,
                tessiture: choriste.tessiture,
                statut: choriste.statut,
                niveau: choriste.niveau,
                date_adhesion: choriste.date_adhesion,
                historiqueStatut: choriste.historiqueStatut
            });
        } else {
            res.status(403).json({ message: 'Accès non autorisé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du profil du choriste' });
    }
};