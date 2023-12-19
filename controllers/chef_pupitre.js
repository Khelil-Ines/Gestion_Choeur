const Chef_Pupitre = require("../models/chef_pupitre");
const Choriste = require("../models/choriste");


exports.Ajouter_Chef_PupitreByID = async (req, res) => {
    try {
        const choriste = await Choriste.findOne({ _id: req.params.id });

        if (!choriste) {
            return res.status(404).send({ message: 'Choriste not found.' });
        } 

        const newChefPupitre = new Chef_Pupitre({
            tessiture : choriste.tessiture,
            statut : choriste.statut,
            niveau : choriste.niveau, 
            date_adhesion:choriste.date_adhesion,
            historiqueStatut: choriste.historiqueStatut,
            nbr_concerts : choriste.nbr_concerts,
            nbr_repetitions : choriste.nbr_repetitions
        });
      

        const savedChefPupitre = await newChefPupitre.save();
        

         choriste.Chef_Pupitre = savedChefPupitre;
      

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
