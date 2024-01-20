
const cron = require('node-cron');
const Choriste = require('../models/choriste');
const Utilisateur = require('../models/utilisateur'); 
const User = require('../models/compte'); 
const crypto = require("crypto");
const Repetition = require("../models/repetition");
const Concert = require("../models/concert");
const nodemailer = require("nodemailer");
const Chef_Pupitre = require("../models/chef_pupitre");
const Absence = require("../models/absence");
const jwt = require("jsonwebtoken");
const saisonCourante = new Date().getFullYear();
const { EventEmitter } = require('events');

const Programme = require('../models/programme'); 


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
      
          // Après la mise à jour du statut, émettez une notification au socket spécifique du choriste
          const choristeSocket = choristesSockets[choriste._id];
          if (choristeSocket) {
              choristeSocket.emit('notification', { message: 'Votre statut a été mis à jour.' });
          }
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
        res.status(201).json({
          models: choriste,
          message: "object cree!",
        });
        Utilisateur.Choriste = saved;
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
            email: choriste.email,
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
          historiqueStatut: choriste.historiqueStatut.sort((a, b) => new Date(b.date) - new Date(a.date)),
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

// // Schedule a cron job to send notifications periodically
cron.schedule('0 0 * * *', async () => {
  try {
    // Query the database for choristes who changed their pupitre in the last 24 hours
    const choristesChanged = await Choriste.find({
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Changed in the last 24 hours
    });

    // Emit notifications for each choriste who changed pupitre
    choristesChanged.forEach((changedChoriste) => {
      req.io.to('updateNotificationsRoom').emit('notificationPupitre', {
        type: 'pupitreChanged',
        message: `Choriste ${changedChoriste.nom} a changé de pupitre en ${changedChoriste.pupitre}.`,
      });
    });

    console.log('Notification cron job executed.');
  } catch (error) {
    console.error('Error in the cron job:', error);
  }
});

exports.updatePupitre = async (req, res ) => {
  try {
    const nouveauPupitre = req.body.pupitre;
    
    // Assurez-vous que le nouveau pupitre est valide
    if (!['Soprano', 'Alto', 'Tenor', 'Basse'].includes(nouveauPupitre)) {
      throw new Error('Tessiture invalide.');
    }

    // Récupérez l'instance du choriste à partir de la base de données
    const choriste = await Choriste.findById(req.params.id);

    if (!choriste) {
      return res.status(404).json({ message: 'Choriste non trouvé.' });
    }

    // Sauvegardez l'ancien pupitre pour vérifier s'il a changé
    const ancienPupitre = choriste.pupitre;

    // Mettez à jour le pupitre du choriste
    choriste.pupitre = nouveauPupitre;

    // Enregistrez les modifications dans la base de données
    await choriste.save();

 // Vérifiez si le pupitre a changé
 if (ancienPupitre !== nouveauPupitre) {
  const message = `Choriste ${choriste.nom} a changé de pupitre de "${ancienPupitre}" à "${nouveauPupitre}".`;
  
  // Emit the event to the specified room
  // Check if req.io is available
  if (req.io) {
    // Emit the event to the specified room
    req.io.to('updateNotificationsRoom').emit('notificationPupitre', {
      type: 'pupitreChanged',
      message,
    });
  } else {
    // Log the notification to the console if req.io is not available
    console.log('Notification:', message);
  }

}

    return res.status(200).json({ choriste, message: 'Tessiture mise à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la modification du pupitre :', error);
    return res.status(500).json({ error: 'Erreur lors de la modification du pupitre.' });
  }
};





  exports.presence = async (req, res) => {
    try {
      const { idRepetition, link } = req.params;
  
      try {
        const choriste = await Choriste.findOne({ compte: req.auth.compteId });
        if (!choriste) {
          return res.status(404).json({ erreur: 'Choriste non trouvé' });
        }
  
        // Recherchez la répétition par son ID
        const repetition = await Repetition.findById(idRepetition);
  
        if (!repetition) {
          return res.status(404).json({ erreur: 'Répétition non trouvée' });
        }
  
        // Vérification si le lien correspond
        if (repetition.link !== link) {
          return res
            .status(401)
            .json({ erreur: 'Lien incorrect pour cette répétition' });
        }
  
        if (repetition.liste_Presents.includes(choriste._id)) {
          return res
            .status(409)
            .json({ erreur: 'Le choriste est déjà présent à cette répétition' });
        }
  
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

//presence_concert
exports.presenceConcert = async (req, res) => {
  try {
    const { idConcert, link } = req.params;

   
    try {
      const choriste = await Choriste.findOne({ compte: req.auth.compteId });
      if (!choriste) {
        return res.status(404).json({ erreur: "choriste non trouvé" });
      }


      // Recherchez la répétition par son ID
      const concert = await Concert.findById(idConcert);

      if (!concert) {
        return res.status(404).json({ erreur: "Concert non trouvé" });
      }

      // Vérification si le lien correspond
      if (concert.link !== link) {
        return res.status(401).json({ erreur: "Lien incorrect pour cet concert" });
      }


      if (!concert.liste_Abs.includes(choriste._id) && !concert.liste_Presents.includes(choriste._id)) {
        return res.status(409).json({ erreur: "Le choriste n'est pas disponible pour ce concert" });
      }

      if (concert.liste_Presents.includes(choriste._id)) {
        return res.status(409).json({ erreur: "Le choriste est déjà présent pour ce concert" });
      }

      // Supprimer l'ID du choriste de la liste d'absence s'il est présent
      concert.liste_Abs = concert.liste_Abs.filter(
        (absentId) => absentId.toString() !== choriste._id.toString()
      );

      // Ajout de l'ID du choriste à la liste de présence
      concert.liste_Presents.push(choriste._id);

      // Mise à jour de la liste des concerts participés du choriste
       // Utilisez l'ID du compte pour trouver le choriste associé
     
      choriste.concertsParticipes.push(idConcert);
      await choriste.save();

      // Sauvegarde de la répétition mise à jour
      await concert.save();

       // Incrémentation du nombre de répétitions dans le modèle Choriste
       await choriste.incrementConcert();
      
      choriste.confirmationStatus = "En attente de confirmation";
      await choriste.save();

      res.json({ message: "Présence ajoutée avec succès" });
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ erreur: "Token invalide" });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).json({ erreur: "Token expiré" });
      } else {
        return res.status(500).json({ erreur: "Erreur interne du serveur" });
      }
    }
  } catch (error) {
    console.error("Erreur lors de la gestion de la présence :", error);
  }
}

exports.setDispo = async (req, res) => {
  const { idConcert } = req.params;

  // Vérifiez le token dans le header de la requête
  const token = req.headers.authorization.split(" ")[1];

  try {
    const choriste = await Choriste.findOne({ compte: req.auth.compteId });
    if (!choriste) {
      return res.status(404).json({ erreur: "choriste non trouvé" });
    }


    // Recherchez le concert par son ID
    const concert = await Concert.findById(idConcert);

    if (!concert) {
      return res.status(404).json({ erreur: "Concert non trouvé" });
    }
     // Générer un jeton unique
     const oneTimeToken = crypto.randomBytes(20).toString('hex');
   // Mettez à jour le statut de confirmation pour le choriste
     choriste.oneTimeToken = oneTimeToken;
     await choriste.save();

    if (concert.liste_dispo.includes(choriste._id)) {
      return res
        .status(409)
        .json({ erreur: "Le choriste est déjà disponible à ce concert" });
    }

const userId=choriste._id

    // Envoi d'un e-mail au choriste pour confirmer sa disponibilité
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ghofranemn22@gmail.com",
        pass: "hgfr npar pidn zvje",
      },
    });

    const mailOptions = {
      from: "ghofranemn22@gmail.com",
      to: choriste.email,
      subject: "Confirmation de disponibilité",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de disponibilité</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #007BFF;
    }

    p {
      margin-bottom: 20px;
    }

    button {
      background-color: #007BFF;
      color: #fff;
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      text-decoration: none;
    }

    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Confirmation de disponibilité</h1>
    <p>Merci de confirmer votre disponibilité en cliquant sur le bouton ci-dessous :</p>
    <form method="get" action="http://127.0.0.1:3000/api/choriste/confirm-dispo/${userId}/${idConcert}/${oneTimeToken}">
      <button type="submit">Confirmer la disponibilité</button>
    </form>
    <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
    <p><a href="http://127.0.0.1:3000/api/choriste/confirm-dispo/${userId}/${idConcert}/${oneTimeToken}">http://127.0.0.1:3000/api/choriste/confirm-dispo/${userId}/${idConcert}/${oneTimeToken}</a></p>
  </div>
</body>
</html>`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
        return res.status(500).json({ erreur: "Erreur interne du serveur" });
      }

      console.log("E-mail envoyé :", info.response);

      res.json({
        message:
          "E-mail de confirmation envoyé. Veuillez confirmer votre disponibilité.",
      });
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ erreur: "Token invalide" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ erreur: "Token expiré" });
    } else {
      return res.status(500).json({ erreur: "Erreur interne du serveur" });
    }
  }
};

exports.confirmDispo = async (req, res) => {
  const { userId, idConcert, uniqueToken } = req.params;
  console.log(userId)
  try {

    const choriste = await Choriste.findById(userId);
    const concert = await Concert.findById(idConcert);

    if (!choriste) {
      return res.status(404).json({ erreur: "Choriste non trouvé" });
    }

    // Vérifiez si le token reçu correspond au token associé au choriste
    if (choriste.oneTimeToken !== uniqueToken) {
      return res.status(401).json({ erreur: "Token de confirmation invalide" });
    }

    choriste.confirmationStatus = "Confirmé";
    choriste.oneTimeToken = null; // Effacez le token après confirmation
    await choriste.save();

    // Ajoutez le choriste à la liste d'absence uniquement après confirmation
    if (
      choriste.confirmationStatus === "Confirmé" &&
      !concert.liste_dispo.includes(userId)
    ) {
      concert.liste_dispo.push(userId);
      await concert.save();
    }

    res.json({
      message:
        "Confirmation réussie. Le choriste a été ajouté à la liste d'absence.",
    });
  } catch (error) {
    console.error("Erreur lors de la confirmation de disponibilité :", error);

    res.status(500).json({ erreur: "Erreur interne du serveur" });
  }
};

// Fonction pour extraire l'ID du choriste à partir du token
exports.getUserIdFromToken = (authorizationHeader) => {
  const token = authorizationHeader.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  return decodedToken.userId;
};

// Fonction pour vérifier la disponibilité du choriste pour ce concert
exports.isChoristeAvailable = (concert, userId) => {
  return concert.liste_Abs.includes(userId) || concert.liste_Presents.includes(userId);
};

// Fonction pour mettre à jour la liste d'absence et de présence
exports.updatePresenceList = (concert, userId) => {
  // Supprimer l'ID du choriste de la liste d'absence s'il est présent
  concert.liste_Abs = concert.liste_Abs.filter(absentId => absentId.toString() !== userId.toString());

  // Ajouter l'ID du choriste à la liste de présence
  concert.liste_Presents.push(userId);
};

exports.getHistoriqueActivite = async (req, res) => {
  try {
    // Obtenez l'ID du choriste à partir du token dans le header
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const compteId = decodedToken.userId;

    // Recherchez le choriste par son ID
    const choriste = await Choriste.findOne({ compte: compteId });

    if (!choriste) {
      return res.status(404).json({ erreur: 'Choriste non trouvé' });
    }

    // Récupérez l'historique du choriste (nombre de répétitions, concerts, etc.)
    const historique = {
      nbr_repetitions: choriste.nbr_repetitions,
      nbr_concerts: choriste.nbr_concerts,
      concerts_participes: [],
    };

    // Pour chaque concert auquel le choriste a participé, récupérez les détails
    for (const concertInfo of choriste.concertsParticipes) {
      const concert = await Concert.findById(concertInfo);

      if (concert) {
        historique.concerts_participes.push({
          date: concert.date,
          lieu: concert.lieu,
          programme: concert.programme, // Mettez à jour selon votre modèle Programme
        });
      }
    }

    res.json({ historique });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique :', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ erreur: 'Token invalide' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ erreur: 'Token expiré' });
    } else {
      return res.status(500).json({ erreur: 'Erreur interne du serveur' });
    }
  }
};

exports.Lister_choriste_toutchoeur = async (req, res) => {
  try {
    const { idConcert } = req.params;

    // Recherchez le concert par son ID
    const concert = await Concert.findById(idConcert);

    if (!concert) {
      return res.status(404).json({ erreur: "Concert non trouvé" });
    }

    // Vérifiez si la liste d'absence est vide
    if (concert.liste_dispo.length === 0) {
      return res.json({ message: "Aucun choriste n'a déclaré sa disponibilité pour ce concert" });
    }

    // Filtrer les choristes par confirmationStatus
    // Filtrer les choristes par confirmationStatus
    const choristesToutChoeur = await Choriste.find(
      {
        confirmationStatus: "Confirmé",
        _id: { $in: concert.liste_dispo },
      },
      // excluez le champ "motDePasse"
      { password: 0 ,
        confirmationStatus : 0 ,
        oneTimeToken:0},);

    res.json({ choristesToutChoeur });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des choristes pour tout le chœur :",
      error
    );
    res.status(500).json({ erreur: "Erreur interne du serveur" });
  }
};

//consulter  la liste des choristes pour tout le chœur pour un concert spécifique

exports.Lister_choriste_pupitre = async (req, res) => {
  try {
    const { idConcert, pupitre } = req.params;

    // Recherchez le concert par son ID
    const concert = await Concert.findById(idConcert);

    if (!concert) {
      return res.status(404).json({ erreur: 'Concert non trouvé' });
    }

    // Vérifiez si le pupitre spécifié existe
    const pupitresExistants = ['Soprano','Alto','Basse','Tenor']; // Ajoutez les pupitres existants
    if (!pupitresExistants.includes(pupitre)) {
      return res.status(400).json({ erreur: `Le pupitre ${pupitre} n'existe pas` });
    }

    // Vérifiez si la liste d'absence est vide
    if (concert.liste_dispo.length === 0) {
      return res.json({ message: "Aucun choriste n'a déclaré sa disponibilité pour ce concert" });
    }

    // Filtrer les choristes par pupitre et confirmationStatus
    const choristesParPupitre = await Choriste.find({
      pupitre: pupitre,
      confirmationStatus: 'Confirmé',
      _id: { $in: concert.liste_dispo },
    },
    // excluez le champ "motDePasse"
    { password: 0 ,
      confirmationStatus : 0 ,
      oneTimeToken:0 , 
      pupitre:0},
    
    );

    // Vérifiez si la liste des choristes par pupitre est vide
    if (choristesParPupitre.length === 0) {
      return res.json({ message: `Aucun choriste du pupitre ${pupitre} n'a déclaré sa disponibilité pour ce concert` });
    }

    res.json({ choristesParPupitre });
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des choristes par pupitre :', error);
    res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
};



exports.login = async (req, res, next) => {
  const { login, motDePasse } = req.body;

  try {
    const user = await User.findOne({ login });

    if (!user) {
      return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
    }

    const validPassword = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!validPassword) {
      return res.status(401).json({ message: 'Login ou mot de passe incorrect' });
    }

    // Mettez à jour l'état de connexion
    console.log(user)
    user.etatConnexion = "true";
    await user.save();

    res.status(200).json({
      token: jwt.sign({ userId: user._id }, 'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }),
    });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

//conulter etat absence en general dans repetitions
// exports.getGeneralAbsenceStatus = async (req, res) => {
//   try {
//     const totalRehearsalAbsences = await Absence.countDocuments({ Type: 'Repetition' });

//     res.json({ totalRehearsalAbsences });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// //conulter etat absence par pupitre
// exports.getAbsenceStatusByPupitre = async (req, res) => {
//   try {
//     const { pupitre } = req.params;

//     // Find all choristers with the specified pupitre and populate the 'absences' field
//     const choristers = await Choriste.find({ pupitre }).populate('absences');

//     // Initialize an array to store details of rehearsal absences for each chorister
//     const rehearsalAbsencesDetails = [];

//     // Calculate total rehearsal absences for the given pupitre
//     let totalRehearsalAbsences = 0;

//     // Iterate through each chorister and count their rehearsal absences
//     for (const chorister of choristers) {
//       const rehearsalAbsences = chorister.absences;

//       // Increment total rehearsal absences count
//       totalRehearsalAbsences += rehearsalAbsences.length;

//       // Store details of rehearsal absences for the current chorister
//       if (rehearsalAbsences.length > 0) {
//         rehearsalAbsencesDetails.push({
//           choristerId: chorister._id,
//           choristerName: chorister.name, // Replace with the actual field name for chorister name
//           rehearsalAbsences: rehearsalAbsences.map(absence => ({
//             absenceId: absence._id,
//             date: absence.Date,
//             reason: absence.raison, // Replace with the actual field name for absence reason
//             rehearsalDetails: {
//               // Include details of the rehearsal
//               rehearsalId: absence.rehearsalId, // Replace with the actual field name for rehearsalId
//               rehearsalDate: absence.rehearsalDate, // Replace with the actual field name for rehearsalDate
//               rehearsalLieu: absence.rehearsalLieu, // Replace with the actual field name for rehearsalLieu
//               // Add more rehearsal details as needed
//             },
           
//           })),
//         });
//       }
//     }

//     res.json({ totalRehearsalAbsences, rehearsalAbsencesDetails });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// //consulter etat absence par choriste
// exports.getAbsencesByChoristeId = async (req, res) => {
//   try {
//     const { choristeId } = req.params;

//     // Find the chorister by ID and populate the 'absences' field
//     const choriste = await Choriste.findById(choristeId).populate('absences');
//     console.log(choriste)

//     if (!choriste) {
//       return res.status(404).json({ error: 'Chorister not found' });
//     }

//     // Calculate total rehearsal absences for the chorister
//     const totalAbsences = choriste.absences.reduce((count, absence) => {
//       return count + (absence.Type === 'Repetition' ? 1 : 0);
//     }, 0);

//     res.json({ choristeId, choristeName: choriste.nom + " " + choriste.prénom, totalAbsences });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// //consulter etat absence 
// exports.getAbsencesByDate = async (req, res) => {
//   try {
//     const { date } = req.params;

//     // Find all choristers and populate the 'absences' field
//     const choristes = await Choriste.find().populate('absences');

//     // Filter absences based on the specified date for all choristers
//     const filteredAbsences = choristes.reduce((allAbsences, chorister) => {
//       const choristerAbsences = chorister.absences.filter(absence => {
//         const absenceDate = new Date(absence.Date).toISOString().split('T')[0]; // Convert to date string without time
//         return absenceDate === date;
//       });

//       return allAbsences.concat(choristerAbsences);
//     }, []);

//     const totalAbsences = filteredAbsences.reduce((count, absence) => {
//       return count + (absence.Type === 'Repetition' ? 1 : 0);
//     }, 0);

//     res.json({ date, totalAbsences, filteredAbsences });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// exports.getAbsenceByPeriod = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.params;

//     // Validate that endDate is greater than startDate
//     if (endDate <= startDate) {
//       return res.status(400).json({ error: 'End date must be greater than start date' });
//     }

//     // Find all choristers and populate the 'absences' field
//     const choristers = await Choriste.find().populate('absences');

//     // Calculate total rehearsal absences and chorister-specific data within the specified period
//     const result = choristers.reduce(
//       (acc, chorister) => {
//         const choristerAbsencesInPeriod = chorister.absences.filter(absence => {
//           const absenceDate = new Date(absence.Date).toISOString().split('T')[0]; // Convert to date string without time
//           return absenceDate >= startDate && absenceDate <= endDate && absence.Type === 'Repetition';
//         });

//         const totalAbsences = choristerAbsencesInPeriod.length;

//         acc.choristersData.push({
//           choristerId: chorister._id,
//           choristerName: chorister.name, // Replace with the actual field name for chorister name
//           totalAbsences,
//           filteredAbsences: choristerAbsencesInPeriod,
//         });

//         acc.totalAbsenceCount += totalAbsences;

//         return acc;
//       },
//       { totalAbsenceCount: 0, choristersData: [] }
//     );

//     res.json({ startDate, endDate, totalAbsenceCount: result.totalAbsenceCount, choristersData: result.choristersData });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// exports.getAbsenceByProgram = async (req, res) => {
//   try {
//     const programId = req.params.ProgrammeId; // Assuming the program ID is passed in the 'programme' parameter

//     // Find all repetitions associated with the program
//     const programRepetitions = await Repetition.find({ programme: programId });

//     // Initialize the total absence count
//     let totalAbsenceCount = 0;

//     // Loop through each repetition and add the length of liste_Abs
//     for (const repetition of programRepetitions) {
//       totalAbsenceCount += repetition.liste_Abs.length;
//     }

//     // Send the result back to the client
//     res.json({ totalAbsenceCount });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error calculating total absence count for program' });
//   }
// };


exports.getAbsenceStatus = async (req, res) => {
  try {
    const { startDate, endDate, date, choristeId, pupitre, ProgrammeId , dateDonne , saison} = req.query;
    
  // Check if endDate is after startDate
  if (endDate < startDate) {
    return res.status(400).json({ error: 'endDate must be after startDate' });
  }

    if (startDate && endDate) {
      // Validate that endDate is greater than startDate
      if (endDate <= startDate) {
        return res.status(400).json({ error: 'End date must be greater than start date' });
      }
    }
    
    

    if (startDate && endDate && pupitre) {
      const choristers = await Choriste.find({ pupitre }).populate('absences');

      const result = choristers.reduce(
        (acc, chorister) => {
          const choristerAbsencesInPeriod = chorister.absences.filter(absence => {
            const absenceDate = new Date(absence.Date).toISOString().split('T')[0];
            return absenceDate >= startDate && absenceDate <= endDate && absence.Type === 'Repetition';
          });

          const totalAbsences = choristerAbsencesInPeriod.length;

          acc.choristersData.push({
            choristerId: chorister._id,
            choristerName: chorister.name,
            totalAbsences,
            filteredAbsences: choristerAbsencesInPeriod,
          });

          acc.totalAbsenceCount += totalAbsences;

          return acc;
        },
        { totalAbsenceCount: 0, choristersData: [] }
      );

      // General absence status
      const totalRehearsalAbsences = await Absence.countDocuments({ Type: 'Repetition' });

      return res.json({ startDate, endDate, pupitre, totalAbsenceCount: result.totalAbsenceCount, choristersData: result.choristersData, totalRehearsalAbsences });
    }

    if (choristeId && ProgrammeId && date) {
      try {
        // Find all repetitions associated with the program
        const choristerRepetitionsForProgram = await Repetition.find({
          programme: ProgrammeId,
        });
    
        // Initialize totalAbsences to 0
        let totalAbsences = 0;
    
        // Iterate through each repetition
        choristerRepetitionsForProgram.forEach(repetition => {
          // Check if liste_Abs contains the choristeId and the date matches
          if (
            repetition.liste_Abs.includes(choristeId) &&
            new Date(repetition.date).toISOString().split('T')[0] === date
          ) {
            // Increment totalAbsences if choristeId and dateDonne are found in liste_Abs
            totalAbsences++;
          }
        });
    
        return res.json({ choristeId, ProgrammeId, date, totalAbsences });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    
    // Check for date and pupitre
    if (date && pupitre) {
      const choristers = await Choriste.find({ pupitre }).populate('absences');

      const filteredAbsences = choristers.reduce((allAbsences, chorister) => {
        const choristerAbsences = chorister.absences.filter(absence => {
          const absenceDate = new Date(absence.Date).toISOString().split('T')[0];
          return absenceDate === date && absence.Type === 'Repetition';
        });

        return allAbsences.concat(choristerAbsences);
      }, []);

      const totalAbsences = filteredAbsences.reduce((count, absence) => {
        return count + (absence.Type === 'Repetition' ? 1 : 0);
      }, 0);

      return res.json({ date, pupitre, totalAbsences, filteredAbsences });
    }

    if (date && pupitre && ProgrammeId) {
      const choristers = await Choriste.find({ pupitre }).populate('absences');
    
      const filteredAbsences = choristers.reduce((allAbsences, chorister) => {
        const choristerAbsences = chorister.absences.filter(absence => {
          const absenceDate = new Date(absence.Date).toISOString().split('T')[0];
          return absenceDate === date && absence.Type === 'Repetition' && absence.programmeId === ProgrammeId;
          // Assuming there is a property named programmeId in the absence object
        });
    
        return allAbsences.concat(choristerAbsences);
      }, []);
    
      const totalAbsences = filteredAbsences.reduce((count, absence) => {
        return count + (absence.Type === 'Repetition' ? 1 : 0);
      }, 0);
    
      return res.json({ date, pupitre, ProgrammeId, totalAbsences, filteredAbsences });
    }
    
    // if (pupitre && ProgrammeId) {
    //   const choristers = await Choriste.find({ pupitre }).populate('absences');
    
    //   const filteredAbsences = choristers.reduce((allAbsences, chorister) => {
    //     const choristerAbsences = chorister.absences.filter(absence => {
    //       return absence.Type === 'Repetition' && absence.programmeId === ProgrammeId;
    //       // Assuming there is a property named programmeId in the absence object
    //     });
    
    //     return allAbsences.concat(choristerAbsences);
    //   }, []);
    
    //   const totalAbsences = filteredAbsences.reduce((count, absence) => {
    //     return count + 1; // Counting all absences without checking the type
    //   }, 0);
    
    //   return res.json({ pupitre, ProgrammeId, totalAbsences, filteredAbsences });
    // }
    

     // Check for choristeId and date
     if (choristeId && date) {
      const choriste = await Choriste.findById(choristeId).populate('absences');

      if (!choriste) {
        return res.status(404).json({ error: 'Chorister not found' });
      }

      const choristerAbsences = choriste.absences.filter(absence => {
        const absenceDate = new Date(absence.Date).toISOString().split('T')[0];
        return absenceDate === date && absence.Type === 'Repetition' ;
      });

      const totalAbsences = choristerAbsences.length;

      return res.json({ choristeId, choristeName: choriste.nom + " " + choriste.prénom, totalAbsences, filteredAbsences: choristerAbsences });
    }

    // Check for choristeId, startDate, and endDate
    if (choristeId && startDate && endDate) {
      const choriste = await Choriste.findById(choristeId).populate('absences');

      if (!choriste) {
        return res.status(404).json({ error: 'Chorister not found' });
      }

      const choristerAbsencesInPeriod = choriste.absences.filter(absence => {
        const absenceDate = new Date(absence.Date).toISOString().split('T')[0];
        return absenceDate >= startDate && absenceDate <= endDate && absence.Type === 'Repetition';
      });

      const totalAbsences = choristerAbsencesInPeriod.length;

      return res.json({ choristeId, choristeName: choriste.nom + " " + choriste.prénom, totalAbsences, filteredAbsences: choristerAbsencesInPeriod });
    }

  // Check for programmeId and date
  if (ProgrammeId && date) {
    try {
      const programRepetitions = await Repetition.find({ programme: ProgrammeId });
  
      let totalAbsenceCount = 0;
  
      for (const repetition of programRepetitions) {
        // Assuming repetition.date is a valid date field in your schema
        const repetitionDate = new Date(repetition.date);
  
        // Check if the date matches the specified date
        if (repetitionDate.toISOString().split('T')[0] === date) {
          totalAbsenceCount += repetition.liste_Abs.length;
        }
      }
  
      return res.json({ ProgrammeId, totalAbsenceCount });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
    

  if (choristeId && ProgrammeId) {
    try {
      // Find all repetitions associated with the program
      const choristerRepetitionsForProgram = await Repetition.find({
        programme: ProgrammeId,
      });
  
      // Initialize totalAbsences to 0
      let totalAbsences = 0;
  
      // Iterate through each repetition
      choristerRepetitionsForProgram.forEach(repetition => {
        // Check if liste_Abs contains the choristeId
        if (repetition.liste_Abs.includes(choristeId)) {
          // Increment totalAbsences if choristeId is found in liste_Abs
          totalAbsences++;
        }
      });
  
      return res.json({ choristeId, ProgrammeId, totalAbsences });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  
  
 

  if (choristeId && ProgrammeId && startDate && endDate) {
    try {
      // Find all repetitions associated with the program
      const choristerRepetitionsForProgram = await Repetition.find({
        programme: ProgrammeId,
      });
  
      // Initialize totalAbsences to 0
      let totalAbsences = 0;
  
      // Iterate through each repetition
      choristerRepetitionsForProgram.forEach(repetition => {
        // Iterate through each absence in liste_Abs
        repetition.liste_Abs.forEach(absence => {
          // Assuming absence.date is a valid date field in your schema
          const absenceDate = new Date(absence.date);
  
          // Check if absenceDate is within the specified date range
          if (!isNaN(absenceDate.getTime()) && absenceDate >= startDate && absenceDate <= endDate) {
            // Check if liste_Abs contains the choristeId
            if (repetition.liste_Abs.includes(choristeId)) {
              // Increment totalAbsences if choristeId is found in liste_Abs and date is within the range
              totalAbsences++;
            }
          }
        });
      });
  
      return res.json({ choristeId, ProgrammeId, startDate, endDate, totalAbsences });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  if (choristeId && dateDonne) {
    try {
      // Find choriste by ID and populate absences
      const choriste = await Choriste.findById(choristeId).populate('absences');
  
      // Check if choriste is not found
      if (!choriste) {
        return res.status(404).json({ error: 'Chorister not found' });
      }
  
      // Filter absences based on the specified date
      const filteredAbsences = choriste.absences.filter(absence => {
        // Assuming absence.Date is a valid date field in your schema
        const absenceDate = new Date(absence.Date).toISOString().split('T')[0];
  
        // Check if absenceDate is on or after the specified date
        return new Date(absenceDate) >= new Date(dateDonne);
      });
  
      // Calculate total absences for the filtered list
      const totalAbsences = filteredAbsences.reduce((count, absence) => {
        return count + (absence.Type === 'Repetition' ? 1 : 0);
      }, 0);
  
      return res.json({ choristeId, choristeName: choriste.nom + " " + choriste.prénom, dateDonne, totalAbsences, filteredAbsences });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  
  if (choristeId && ProgrammeId && dateDonne) {
    try {
      // Find all repetitions associated with the program
      const choristerRepetitionsForProgram = await Repetition.find({
        programme: ProgrammeId,
      });
  
      // Initialize totalAbsences to 0
      let totalAbsences = 0;
  
      // Iterate through each repetition
      choristerRepetitionsForProgram.forEach(repetition => {
        // Check if liste_Abs contains the choristeId and the date is on or after dateDonne
        if (
          repetition.liste_Abs.includes(choristeId) &&
          new Date(repetition.date).toISOString().split('T')[0] >= dateDonne
        ) {
          // Increment totalAbsences if choristeId and dateDonne conditions are met
          totalAbsences++;
        }
      });
  
      return res.json({ choristeId, ProgrammeId, dateDonne, totalAbsences });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  
  
    // Check for choristerId
    if (choristeId) {
      const choriste = await Choriste.findById(choristeId).populate('absences');

      if (!choriste) {
        return res.status(404).json({ error: 'Chorister not found' });
      }

      const totalAbsences = choriste.absences.reduce((count, absence) => {
        return count + (absence.Type === 'Repetition' ? 1 : 0);
      }, 0);

      return res.json({ choristeId, choristeName: choriste.nom + " " + choriste.prénom, totalAbsences });
    }

    if (dateDonne) {
      try {
        const choristes = await Choriste.find().populate('absences');
    
        const filteredAbsences = choristes.reduce((allAbsences, chorister) => {
          const choristerAbsences = chorister.absences.filter(absence => {
            // Assuming absence.Date is a valid date field in your schema
            const absenceDate = new Date(absence.Date).toISOString().split('T')[0];
            
            // Check if absenceDate is on or after the specified date
            return new Date(absenceDate) >= new Date(dateDonne);
          });
    
          return allAbsences.concat(choristerAbsences);
        }, []);
    
        const totalAbsences = filteredAbsences.reduce((count, absence) => {
          return count + (absence.Type === 'Repetition' ? 1 : 0);
        }, 0);
    
        return res.json({ dateDonne, totalAbsences, filteredAbsences });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    

    // Check for date
    if (date) {
      const choristes = await Choriste.find().populate('absences');

      const filteredAbsences = choristes.reduce((allAbsences, chorister) => {
        const choristerAbsences = chorister.absences.filter(absence => {
          const absenceDate = new Date(absence.Date).toISOString().split('T')[0];
          return absenceDate === date;
        });

        return allAbsences.concat(choristerAbsences);
      }, []);

      const totalAbsences = filteredAbsences.reduce((count, absence) => {
        return count + (absence.Type === 'Repetition' ? 1 : 0);
      }, 0);

      return res.json({ date, totalAbsences, filteredAbsences });
    }

    // Check for startDate and endDate
    if (startDate && endDate) {
      const choristers = await Choriste.find().populate('absences');

      const result = choristers.reduce(
        (acc, chorister) => {
          const choristerAbsencesInPeriod = chorister.absences.filter(absence => {
            const absenceDate = new Date(absence.Date).toISOString().split('T')[0];
            return absenceDate >= startDate && absenceDate <= endDate && absence.Type === 'Repetition';
          });

          const totalAbsences = choristerAbsencesInPeriod.length;

          acc.choristersData.push({
            choristerId: chorister._id,
            choristerName: chorister.name,
            totalAbsences,
            filteredAbsences: choristerAbsencesInPeriod,
          });

          acc.totalAbsenceCount += totalAbsences;

          return acc;
        },
        { totalAbsenceCount: 0, choristersData: [] }
      );

      return res.json({ startDate, endDate, totalAbsenceCount: result.totalAbsenceCount, choristersData: result.choristersData });
    }

    // Check for pupitre
    if (pupitre) {
      const choristers = await Choriste.find({ pupitre }).populate('absences');

      const rehearsalAbsencesDetails = [];
      let totalRehearsalAbsences = 0;

      for (const chorister of choristers) {
        const rehearsalAbsences = chorister.absences;

        totalRehearsalAbsences += rehearsalAbsences.length;

        if (rehearsalAbsences.length > 0) {
          rehearsalAbsencesDetails.push({
            choristerId: chorister._id,
            choristerName: chorister.name,
            rehearsalAbsences: rehearsalAbsences.map(absence => ({
              absenceId: absence._id,
              date: absence.Date,
              reason: absence.raison,
              rehearsalDetails: {
                rehearsalId: absence.rehearsalId,
                rehearsalDate: absence.rehearsalDate,
                rehearsalLieu: absence.rehearsalLieu,
              },
            })),
          });
        }
      }

      return res.json({ totalRehearsalAbsences, rehearsalAbsencesDetails });
    }

    // Check for ProgrammeId
    if (ProgrammeId) {
      // Find all repetitions associated with the program
      const programRepetitions = await Repetition.find({ programme: ProgrammeId });

      // Initialize the total absence count
      let totalAbsenceCount = 0;

      // Loop through each repetition and add the length of liste_Abs
      for (const repetition of programRepetitions) {
        totalAbsenceCount += repetition.liste_Abs.length;
      }

      // Send the result back to the client
      return res.json({ totalAbsenceCount });
    }

if (saison)
{
  const now = new Date();
  const currentYear = now.getFullYear();
  
  try {
    const choristes = await Choriste.find().populate('absences');
  
    const filteredAbsences = choristes.reduce((allAbsences, chorister) => {
      const choristerAbsences = chorister.absences.filter(absence => {
        // Assuming absence.Date is a valid date field in your schema
        const absenceYear = new Date(absence.Date).getFullYear();
        
        // Check if the absence is from the current year or later
        return absenceYear >= currentYear;
      });
  
      return allAbsences.concat(choristerAbsences);
    }, []);
  
    const totalAbsences = filteredAbsences.reduce((count, absence) => {
      return count + (absence.Type === 'Repetition' ? 1 : 0);
    }, 0);
  
    return res.json({ currentYear, totalAbsences, filteredAbsences });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  
}

    // Check for startDate, endDate, and pupitre
 

    // General absence status
    const totalRehearsalAbsences = await Absence.countDocuments({ Type: 'Repetition' });

    return res.json({ totalRehearsalAbsences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};












