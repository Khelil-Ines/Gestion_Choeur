const cron = require('node-cron');
const Choriste = require('../models/choriste');
const Utilisateur = require('../models/utilisateur');

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

// const moment = require('moment');

// Fonction pour vérifier si un choriste est en congé
// const estEnConge = (choriste) => {
//   const maintenant = moment();
  
//   // Vérifier si le choriste a des dates de congé définies
//   if (choriste.dateDebutConge && choriste.dateFinConge) {
//     const dateDebutConge = moment(choriste.dateDebutConge);
//     const dateFinConge = moment(choriste.dateFinConge);

//     // Vérifier si la date actuelle est pendant la période de congé
//     if (maintenant.isBetween(dateDebutConge, dateFinConge, null, '[]')) {
//       return true; // Le choriste est en congé
//     }
//   }

//   return false; // Le choriste n'est pas en congé
// };


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
  
  
  




