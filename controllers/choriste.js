
const cron = require('node-cron');
const Choriste = require('../models/choriste');
const Utilisateur = require('../models/utilisateur'); 
const User = require("../models/choriste");
const bcrypt = require("bcrypt");
const Repetition = require("../models/repetition");
const jwt = require("jsonwebtoken");
const saisonCourante = new Date().getFullYear(); 


// Tâche planifiée pour déclencher la mise à jour du statut au début de chaque saison,programmée pour s'exécuter à minuit le 1er octobre de chaque année
const tacheMiseAJourStatut = cron.schedule('0 0 1 10 * ', async () => {
    try {
        
        
        // Récupérer tous les choristes à partir de la base de données 
        const choristes = await Choriste.find();
       

        // Mettre à jour le statut pour chaque choriste
        for (const choriste of choristes) {
      

            if (choriste.date_adhesion.getFullYear() === saisonCourante) {
                choriste.niveau = "Junior";
                

             } else if ( choriste.date_adhesion.getFullYear() === saisonCourante - 1) {
                 choriste.niveau = "Choriste";
             } else if (((choriste.date_adhesion.getFullYear() - saisonCourante) >= 3  ) && choriste.nbr_repetitions >= 5 && choriste.nbr_concerts >= 5) {
                 choriste.niveau = "Sénior";
             } else if (choriste.date_adhesion.getFullYear() === 2018 || choriste.date_adhesion.getFullYear() === 2019) {
                 choriste.niveau = "Vétéran"; 
                 console.log('probleme 8')
             }else {
                 choriste.niveau = "Choriste"; 
             }
             await Choriste.collection.updateOne({ _id: this._id }, { $set: { historiqueStatut: this.historiqueStatut }})
             choriste.historiqueStatut.push({ statut: choriste.niveau, date: new Date() });

              savedchoriste = await choriste.save();
              Utilisateur.Choriste = savedchoriste;
         

        }

        console.log('Mise à jour réussie pour tous les choristes');
    } catch (error) {
        console.error('Erreur lors de la mise à jour des statuts des choristes', error);
    }
});

tacheMiseAJourStatut.start();

exports.addChoriste = (req, res) => {
    const choriste = new Choriste(req.body);
    saved = choriste
      .save()
      .then(() => {
        Utilisateur.Choriste = choriste;
        res.status(201).json({
          models: choriste,
          message: "object cree!",
        });
      })
      .catch((error) => {
        
        res.status(400).json({
          error: error.message,
          message: "Donnee invalides",
        });
      });
  };
exports.getprofilchoriste = async (req, res) => {
    Choriste.findOne({ _id: req.params.id })
    .then((choriste) => {
      if (!choriste) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
            nom : choriste.nom,
            prénom : choriste.prénom,
            num_tel:choriste.num_tel,
            CIN :choriste.CIN,
            adresse: choriste.adresse,
            mail: choriste.mail,
            date_naiss:choriste.date_naiss,
            sexe : choriste.sexe,
            tessiture : choriste.tessiture,
            statut : choriste.statut,
            niveau : choriste.niveau,
            date_adhesion: choriste.date_adhesion,
            nbr_concerts : choriste.nbr_concerts,
            nbr_repetitions : choriste.nbr_repetitions,
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
};

exports.getstatutchoriste = async (req, res) => {
    Choriste.findOne({ _id: req.params.id })
    .then((choriste) => {
      if (!choriste) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
            Historique : choriste.historiqueStatut.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
              }),
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
};



//Fonction pour vérifier si un choriste est en congé
exports.estEnConge = (choriste) => {
  const maintenant = moment();
  
  // Vérifier si le choriste a des dates de congé définies
  if (choriste.dateDebutConge && choriste.dateFinConge) {
    const dateDebutConge = moment(choriste.dateDebutConge);
    const dateFinConge = moment(choriste.dateFinConge);

    // Vérifier si la date actuelle est pendant la période de congé
    if (maintenant.isBetween(dateDebutConge, dateFinConge, null, '[]')) {
      return true; // Le choriste est en congé
    }
  }

  return false; // Le choriste n'est pas en congé
};


exports.fetchChoriste = (req, res) => {
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

exports.addChoriste = (req, res) => { 
  const newChoriste = new Choriste(req.body);
  newChoriste.save()
      .then(choriste => {
          res.json(choriste);
      })
      .catch(err => {
          res.status(400).json({ erreur: 'Échec de la création du l\'choriste' });
      });
}
  
exports.getChoriste = (req, res) => {
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


  exports.getChoristesByPupitre = (req, res) => {
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

  exports.updatePupitre = async (req, res)=> {
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
  

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then((response) => {
          const newUser = response.toPublic();
          res.status(201).json({
            user: newUser,
            message: "utilisateur crée",
          });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Login ou mot passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
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



exports.presence = async (req, res) => {
  try {
    const { idRepetition, link } = req.params;

    // Vérifiez le token dans le header de la requête
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
      const userId = decodedToken.userId;

      // Recherchez la répétition par son ID
      const repetition = await Repetition.findById(idRepetition);

      if (!repetition) {
        return res.status(404).json({ erreur: 'Répétition non trouvée' });
      }

      // Vérification si le lien correspond
      if (repetition.link !== link) {
        return res.status(401).json({ erreur: 'Lien incorrect pour cette répétition' });
      }

      if (repetition.liste_Presents.includes(userId)) {
        return res.status(409).json({ erreur: 'Le choriste est déjà présent à cette répétition' });
      }

      // Supprimer l'ID du choriste de la liste d'absence s'il est présent
      repetition.liste_Abs = repetition.liste_Abs.filter(absentId => absentId.toString() !== userId.toString());

      // Ajout de l'ID du choriste à la liste de présence
      repetition.liste_Presents.push(userId);

      // Sauvegarde de la répétition mise à jour
      await repetition.save();

      res.json({ message: 'Présence ajoutée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la vérification du token :', error);

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ erreur: 'Token invalide' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ erreur: 'Token expiré' });
      } else {
        return res.status(500).json({ erreur: 'Erreur interne du serveur' });
      }
    }
  } catch (error) {
    console.error('Erreur lors de la gestion de la présence :', error);
    res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
};





