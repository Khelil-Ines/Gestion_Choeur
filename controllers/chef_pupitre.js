const Chef_Pupitre = require("../models/chef_pupitre");
const Choriste = require("../models/choriste");
const utilisateur = require("../models/utilisateur");
const User = require('../models/compte'); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Repetition = require("../models/repetition");
const Concert = require("../models/concert");

exports.Ajouter_Chef_PupitreByID = async (req, res) => {
    try {
        const choriste = await Choriste.findOne({ _id: req.params.id });

        if (!choriste) {
            return res.status(404).send({ message: 'Choriste not found.' });
        } 
        const nom = choriste.nom
        const prénom = choriste.prénom
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
            nom : nom,
            prénom : prénom,
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

exports.login = (req, res, next) => {
    User.findOne({ login: req.body.login })
      .then((user) => {
        if (!user) {
          return res
            .status(401)
            .json({ message: "Login ou mot passe incorrecte" });
        }
        bcrypt
          .compare(req.body.motDePasse, user.motDePasse)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ message: "Login ou mot passe incorrecte" });
            }
            res.status(200).json({
              token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                expiresIn: "24h",
              }),
            });
          })
          .catch((error) => res.status(500).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  };


  exports.sauvegarderPresenceRepetition = async (req, res) => {
    try {
      // Récupérez l'ID de la répétition et l'ID du choriste à partir des paramètres de la requête
      const { idRepetition, idChoriste } = req.params;
  
      // Récupérez le token du chef de pupitre dans le header
      const token = req.headers.authorization.split(' ')[1];
  
      // Vérifiez et décryptez le token pour obtenir l'ID du chef de pupitre

      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const compteId = decodedToken.userId;

      // Recherchez le compte par son ID
      const compte = await User.findById(compteId);
      console.log(compte)
     
      if (!compte) {
        return res.status(404).json({ erreur: 'Compte non trouvé' });
      }
     
   
      const chefPupitre = await Chef_Pupitre.findOne({compte:compteId});
      
      console.log(chefPupitre.pupitre)
      // Vérifiez si le choriste appartient au même pupitre que le chef de pupitre
      const choriste = await Choriste.findById(idChoriste);
      if (!choriste || choriste.pupitre !== chefPupitre.pupitre) {
        return res.status(403).json({ erreur: 'Accès non autorisé' });
      }
  
      // Récupérez la répétition
      const repetition = await Repetition.findById(idRepetition);
      if (!repetition) {
        return res.status(404).json({ erreur: 'Répétition non trouvée' });
      }
   

      if (repetition.liste_Presents.includes(choriste._id)) {
        return res
          .status(409)
          .json({ erreur: 'Le choriste est déjà présent à cette répétition' });
      }

      // Enregistrez la présence manuelle
      choriste.presencesManuelles.push({ raison:req.body.raison, date: new Date() });
      await choriste.save();
      
      // Supprimer l'ID du choriste de la liste d'absence s'il est présent
      repetition.liste_Abs = repetition.liste_Abs.filter(
        (absentId) => absentId.toString() !== choriste._id.toString()
      );

      // Ajout de l'ID du choriste à la liste de présence
      repetition.liste_Presents.push(choriste._id);

      // Sauvegarde de la répétition mise à jour
      await repetition.save();

      // Incrémentation du nombre de répétitions dans le modèle Choriste
      await choriste.incrementRepetitions();
  
      res.json({ message: 'Présence manuelle ajoutée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la présence manuelle pour la répétition :', error);
      res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
  };


  exports.sauvegarderPresenceConcert = async (req, res) => {
    try {
      // Récupérez l'ID du concert et l'ID du choriste à partir des paramètres de la requête
      const { idConcert, idChoriste } = req.params;
  
      // Récupérez le token du chef de pupitre dans le header
      const token = req.headers.authorization.split(' ')[1];
  
      // Vérifiez et décryptez le token pour obtenir l'ID du chef de pupitre
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const compteId = decodedToken.userId;
  
      // Recherchez le compte par son ID
      const compte = await User.findById(compteId);
      if (!compte) {
        return res.status(404).json({ erreur: 'Compte non trouvé' });
      }
  
      const chefPupitre = await Chef_Pupitre.findOne({ compte: compteId });
  
      // Vérifiez si le choriste appartient au même pupitre que le chef de pupitre
      const choriste = await Choriste.findById(idChoriste);
      if (!choriste || choriste.pupitre !== chefPupitre.pupitre) {
        return res.status(403).json({ erreur: 'Accès non autorisé' });
      }
  
      // Récupérez le concert
      const concert = await Concert.findById(idConcert);
      if (!concert) {
        return res.status(404).json({ erreur: 'Concert non trouvé' });
      }
  
    
  
      if (concert.liste_Presents.includes(choriste._id)) {
        return res.status(409).json({ erreur: 'Le choriste est déjà présent à ce concert' });
      }
        // Enregistrez la présence manuelle
        choriste.presencesManuelles.push({ raison: req.body.raison, date: new Date() });
        await choriste.save();

      // Supprimer l'ID du choriste de la liste d'absence s'il est présent
      concert.liste_Abs = concert.liste_Abs.filter(
        (absentId) => absentId.toString() !== choriste._id.toString()
      );
  
      // Ajout de l'ID du choriste à la liste de présence
      concert.liste_Presents.push(choriste._id);
  
      // Sauvegarde du concert mis à jour
      await concert.save();

      choriste.concertsParticipes.push(idConcert);
      await choriste.save();

  
      // Incrémentation du nombre de concerts dans le modèle Choriste
      await choriste.incrementConcerts();
  
      res.json({ message: 'Présence manuelle ajoutée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la présence manuelle pour le concert :', error);
      res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
  };
  