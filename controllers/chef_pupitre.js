const Chef_Pupitre = require("../models/chef_pupitre");
const Choriste = require("../models/choriste");
const utilisateur = require("../models/utilisateur");


exports.Ajouter_Chef_PupitreByID = async (req, res) => {
    try {
        const choriste = await Choriste.findOne({ _id: req.params.id });

        if (!choriste) {
            return res.status(404).send({ message: 'Choriste not found.' });
        } 

        const pupitre = choriste.pupitre
        const statut = choriste.statut
        const CIN = choriste.CIN
        const niveau = choriste.niveau
        const date_adhesion=choriste.date_adhesion
        const historiqueStatut= choriste.historiqueStatut
        const nbr_concerts = choriste.nbr_concerts
        const nbr_repetitions =choriste.nbr_repetitions

        await Choriste.findByIdAndDelete({ _id: req.params.id });

        const newChefPupitre = new Chef_Pupitre({
            pupitre : pupitre,
            statut : statut,
            CIN : CIN,
            niveau : niveau, 
            date_adhesion:date_adhesion,
            historiqueStatut: historiqueStatut,
            nbr_concerts : nbr_concerts,
            nbr_repetitions : nbr_repetitions
        });
      
        const savedChefPupitre = await newChefPupitre.save();

        
        utilisateur.Chef_Pupitre = savedChefPupitre;
      

        res.status(200).send({ message: 'Chef de pupitre ajouté !' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

exports.get_chefs = async (req, res) => {
    try {
        const chefs = await Chef_Pupitre.find();
        res.status(200).send(chefs);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
