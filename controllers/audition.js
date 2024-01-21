const Planning = require('../models/audition')
const moment = require('moment');
const Candidat = require('../models/candidat');
const Choriste = require('../models/choriste');
const Compte = require('../models/compte');
const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require("path");
const bcrypt = require('bcrypt');
const Audition = require('../models/audition');

//Ines CRUD Audition 



const updateAudition = (req, res) => {
  Audition.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    req.body,
    { new: true }
  )
    .then((audition) => {
      if (!audition) {
        res.status(404).json({
          message: "Audition non trouvé",
        });
      } else {
        res.status(200).json({
          model: audition,
          message: "Audition modifié",
        });
      }
    })
    .catch((error) => res.status(400).json({ error: error.message }));
};

const deleteAudition = async (req, res) => {
  try {
    const audition = await Audition.findOne({ _id: req.params.id });

    if (!audition) {
      return res.status(404).json({
        message: "Audition non trouvée!",
      });
    }

    const result = await Audition.deleteOne({ _id: req.params.id });

    if (result.deletedCount === 1) {
      return res.status(200).json({
        model: audition,
        message: "Audition supprimée!",
      });
    } else {
      return res.status(500).json({
        message: "Audition trouvée mais non supprimée!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      message: "Une erreur s'est produite lors de la suppression de l'audition!",
    });
  }
};



const fetchAudition = async (req, res) => {
  try {
    const audition = await Audition.findOne({ _id: req.params.id }).populate('candidat');
    if (!audition) {
      return res.status(404).json({ message: "objet non trouvé!" });
    }
    res.status(200).json({ model: audition, message: "objet trouvé!" });
  } catch (error) {
    res.status(400).json({ error: error.message, message: "Données invalides!" });
  }
};

const addAudition = async (req, res) => {
  try {
    const newAudition = new Audition(req.body);
    const candidat = await Candidat.findOne({ _id: req.body.candidat });
    if (candidat) {
    const audition = await newAudition.save();
    res.json(audition);
    }else{
      res.status(404).json({ message: "Candidat non trouvé!" });
    }
  } catch (err) {
    res.status(400).json({ erreur: `Échec de la création de l'audition: ${err.message}` });
  }
};

const getAudition = async (req, res) => {
  try {
    const auditions = await Audition.find().populate('candidat');
    res.status(200).json({ model: auditions, message: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message, message: "problème d'extraction" });
  }
};


//generer planning pour tout les candidats
const genererPlanning = async (req, res, next) => {
  const { startDate, sessionStartTime, sessionEndTime, candidatesPerHour } =
    req.params;

  // Convertissez les valeurs au besoin
  let dateDebut = moment(startDate);
  let heureDebut = moment(sessionStartTime, "HH:mm");
  let heureFin = moment(sessionEndTime, "HH:mm");
  const nbreCandidatsParHeure = parseInt(candidatesPerHour);

  try {
    if (!heureDebut.isBefore(heureFin)) {
      return res
        .status(400)
        .json({ message: "Invalid start time or end time." });
    }

    // Ensure dateDebut is equal to or greater than the current date
    if (dateDebut.isBefore(moment(), "day")) {
      return res.status(400).json({ message: "Invalid date." });
    }
    // Récupérez tous les candidats depuis votre modèle Candidat
    const candidats = await Candidat.find({}, "_id");

    const planning = [];

    while (candidats.length > 0) {
      // Si la plage horaire spécifiée pour une journée est terminée, passez à la journée suivante
      if (heureDebut.isSameOrAfter(heureFin)) {
        dateDebut = dateDebut.add(1, "day");
        heureDebut = moment(sessionStartTime, "HH:mm");
        heureFin = moment(sessionEndTime, "HH:mm");
      }

      // Générez les plages horaires pour toute la journée
      while (heureDebut.isBefore(heureFin) && candidats.length > 0) {
        // Sélectionnez le nombre de candidats requis pour cette session
        const candidatsPourSession = candidats.splice(0, nbreCandidatsParHeure);

        candidatsPourSession.forEach((candidat, index) => {
          const sessionPlanning = new Planning({
            dateAudition: dateDebut.format("YYYY-MM-DD"),
            HeureDeb: heureDebut.format("HH:mm"),
            HeureFin: heureDebut.clone().add(1, "hour").format("HH:mm"),
            candidat: candidat._id,
          });

          planning.push(sessionPlanning);

          // Si c'est le dernier candidat de la session, incrémente l'heure de début pour la prochaine session
          if (index === candidatsPourSession.length - 1) {
            heureDebut.add(1, "hour");
          }
        });
      }
    }

    // Enregistrez le planning dans la base de données
    const planningEnregistre = await Planning.insertMany(planning);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ghofranemn22@gmail.com",
        pass: "hgfr npar pidn zvje",
      },
    });

    try {
      // Parcourez le planning et envoyez un e-mail à chaque candidat
      for (const session of planning) {
        // Recherche du candidat par ID
        const candidatDetails = await Candidat.findOne({
          _id: session.candidat,
        });

        // Vérifiez si l'e-mail du candidat est défini
        if (candidatDetails && candidatDetails.email) {
          const destinataire = candidatDetails.email;
          const sujet = "Détails de votre audition";
          // HTML content for the email
          const htmlContent = `
          <!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #3498db;
    }

    p {
      color: #555;
    }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #ddd;
      text-align: center;
      color: #777;
    }

    .accent {
      color: #e74c3c;
      font-weight: bold;
    }

    .logo {
      text-align: center;
    }

    .logo img {
      max-width: 100px;
      height: auto;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="logo">
      <img src="C:\Users\ghofr\OneDrive\Bureau\Gestion_Choeur\files\choeur.png" alt="Your Organization Logo">
    </div>
    <h1 style="text-align: center;">Confirmation d'audition</h1>
    <p>Bonjour,</p>
    <p>Votre audition est prévue pour le <span class="accent">${moment(
      session.dateAudition
    )
      .locale("fr")
      .format("LL")} à ${session.HeureDeb}</span>.</p>
    <p>Merci de vous préparer et d'arriver à l'heure. Nous sommes impatients de vous rencontrer!</p>
    <p>Cordialement,<br>Choeur du CSO</p>
    <div class="footer">
      <p>Merci,<br>Choeur du CSO</p>
    </div>
  </div>
</body>

</html>
        `;

          // Use the htmlContent in your email sending logic

          // Envoie de l'e-mail with HTML content
          await transporter.sendMail({
            from: "ghofranemn22@gmail.com",
            to: destinataire,
            subject: sujet,
            html: htmlContent,
          });

          console.log(
            `E-mail envoyé à ${destinataire} pour l'audition le ${session.dateAudition} à ${session.HeureDeb}`
          );
        } else {
          console.error(
            "Aucun e-mail défini pour le candidat :",
            session.candidat
          );
        }
      }

      console.log("E-mails envoyés avec succès");
    } catch (error) {
      console.error("Erreur lors de l'envoi des e-mails :", error);
      throw new Error("Erreur lors de l'envoi des e-mails");
    } finally {
      transporter.close();
    }

    res.status(201).json({
      message: "Planning généré avec succès",
      planning: planningEnregistre,
    });
  } catch (error) {
    console.error("Erreur lors de la génération du planning :", error);
    res.status(500).json({
      message: "Erreur lors de la génération du planning",
      error: error.message,
    });
  }
};

//voir le planning des auditions
const fetchPlanning = async (req, res) => {
  try {
    const planning = await Planning.find().populate("candidat");
    res.status(200).json({
      model: planning,
      message: "success!",
    });
  } catch (error) {
    console.error("Problème d'extraction des plannings :", error);
    res.status(400).json({
      error: error.message,
      message: "Problème d'extraction des plannings !",
    });
  }
};

//voir le planning d'un candidat precis
const fetchPlanningByid = async (req, res) => {
  try {
    const candidatId = req.params.candidatId;

    const planning = await Planning.find({ candidat: candidatId }).populate(
      "candidat"
    );

    if (!planning || planning.length === 0) {
      return res.status(404).json({
        message: "Aucun planning trouvé pour le candidat avec l'ID fourni.",
      });
    }

    res.status(200).json({
      model: planning,
      message: "Success!",
    });
  } catch (error) {
    console.error("Problème d'extraction des plannings :", error);
    res.status(500).json({
      error: error.message,
      message: "Problème d'extraction des plannings !",
    });
  }
};

// //voir le planning par heure
// const fetchPlanningByhour = async (req, res) => {
//   try {
//     const heureDeb = req.params.heureDeb;
//     console.log("Heure fournie :", heureDeb);

//     const planning = await Planning.find({ HeureDeb: heureDeb }).populate("candidat");
//     console.log("Planning trouvé :", planning);

//     if (!planning || planning.length === 0) {
//       return res.status(404).json({
//         message: "Aucun planning trouvé pour l'heure fournie.",
//       });
//     }

//     res.status(200).json({
//       model: planning,
//       message: "Success!",
//     });
//   } catch (error) {
//     console.error("Erreur lors de l'extraction des plannings :", error);

//     res.status(500).json({
//       error: error.message,
//       message: "Problème d'extraction des plannings !",
//     });
//   }
// };
// //voir le planning par date
// const fetchPlanningByDate = async (req, res) => {
//   try {
//     const formattedDate = req.params.dateAudition;

//     // Recherche des plannings pour la date spécifiée
//     const plannings = await Planning.find({ dateAudition: formattedDate })
//       .populate('candidat'); // Populate the candidat field with the details from the Candidat model

//     res.status(200).json({
//       message: `Plannings pour la date ${formattedDate} récupérés avec succès`,
//       plannings: plannings,
//     });
//   } catch (error) {
//     console.error('Erreur lors de la récupération des plannings par date :', error);
//     res.status(500).json({
//       message: 'Erreur lors de la récupération des plannings par date',
//       error: error.message,
//     });
//   }
// };

//voir le planning par candidat name

const trouverIdCandidatParNom = async (nomCandidat) => {
  // Utiliser le nom converti dans la recherche
  const candidat = await Candidat.findOne({ nom: nomCandidat });

  return candidat ? candidat._id : null;
};

const fetchPlanningByCandidat = async (req, res) => {
  const nomCandidat = req.query.nom;

  if (!nomCandidat) {
    return res.status(400).json({
      error: "Le nom du candidat est requis en tant que paramètre de requête.",
    });
  }

  const idCandidat = await trouverIdCandidatParNom(nomCandidat);

  if (idCandidat) {
    const planning = await Planning.find({ candidat: idCandidat });
    res.json({ planning: planning });
  } else {
    res.status(404).json({ error: "Candidat non trouvé." });
  }
};

const fetchPlanningByDateHeure = async (req, res) => {
  try {
    const dateAudition = req.query.dateAudition;
    const heureDeb = req.query.heureDeb;

    let query = {};

    // Ajouter les conditions de recherche en fonction des paramètres fournis
    if (dateAudition) {
      query.dateAudition = dateAudition;
    }

    if (heureDeb) {
      query.HeureDeb = heureDeb;
    }

    // Recherche des plannings en fonction des conditions spécifiées
    const plannings = await Planning.find(query).populate("candidat");

    if (!plannings || plannings.length === 0) {
      return res.status(404).json({
        message: "Aucun planning trouvé pour les critères spécifiés.",
      });
    }

    res.status(200).json({
      message: "Plannings récupérés avec succès",
      plannings: plannings,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des plannings :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des plannings",
      error: error.message,
    });
  }
};

const envoyerEmailAuxCandidats = async (plannings) => {
  let transporter;

  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ghofranemn22@gmail.com",
        pass: "hgfr npar pidn zvje",
      },
    });

    await Promise.all(
      plannings.map(async (planning) => {
        const destinataire = planning.mail;
        const sujet = "Détails de votre nouvelle audition";
        const dateAuditionMoment = moment(planning.dateAudition)
          .locale("fr")
          .format("LL");
        const html = `<!DOCTYPE html>
        <html lang="fr">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
        
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        
            h1 {
              color: #3498db;
            }
        
            p {
              color: #555;
            }
        
            .footer {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 1px solid #ddd;
              text-align: center;
              color: #777;
            }
        
            .accent {
              color: #e74c3c;
              font-weight: bold;
            }
        
            .logo {
              text-align: center;
            }
        
            .logo img {
              max-width: 100px;
              height: auto;
            }
        
            .renewal {
              background-color: #f9f9f9;
              padding: 10px;
              border-radius: 5px;
              margin-top: 15px;
            }
          </style>
        </head>
        
        <body>
          <div class="container">
            <div class="logo">
              <img src="https://weezevent.com/wp-content/uploads/2023/07/31160928/organiser-chorale.jpg" alt="Your Organization Logo">
            </div>
            <h1 style="text-align: center;">Renouvellement d'Audition</h1>
            <p>Bonjour,</p>
            <p>Votre audition est renouvelée et prévue pour le <span class="accent">${dateAuditionMoment} à ${planning.HeureDeb}</span>.</p>
            <div class="renewal">
              <p>Renouvellement d'audition</p>
            </div>
            <p>Merci de vous préparer et d'arriver à l'heure. Nous sommes impatients de vous rencontrer à nouveau!</p>
            <p>Cordialement,<br>Votre Chœur</p>
            <div class="footer">
              <p>Merci,<br>Votre Chœur</p>
            </div>
          </div>
        </body>
        
        </html>
        `;

        // Envoi de l'e-mail
        await transporter.sendMail({
          from: "ghofranemn22@gmail.com",
          to: destinataire,
          subject: sujet,
          html: html,
        });

        console.log(
          `E-mail envoyé à ${destinataire} pour l'audition le ${dateAuditionMoment} à ${planning.HeureDeb}`
        );
      })
    );

    console.log("E-mails envoyés avec succès aux candidats.");
  } catch (error) {
    console.error("Erreur lors de l'envoi des e-mails aux candidats :", error);
    throw new Error("Erreur lors de l'envoi des e-mails aux candidats.");
  } finally {
    if (transporter) {
      transporter.close();
    }
  }
};

const genererPlanningDefaillants = async (req, res, next) => {
  try {
    const {
      startDate,
      sessionStartTime,
      sessionEndTime,
      candidatesPerHour,
      candidateIds,
    } = req.body;

    const dateDebut = moment(startDate);
    const heureDebut = moment(sessionStartTime, "HH:mm");
    const heureFin = moment(sessionEndTime, "HH:mm");
    const nbreCandidatsParHeure = parseInt(candidatesPerHour);

    if (!candidateIds || candidateIds.length === 0) {
      return res.status(400).json({ message: "Aucun ID de candidat fourni." });
    }

    if (!heureDebut.isBefore(heureFin)) {
      return res
        .status(400)
        .json({ message: "Invalid session start time or session end time" });
    }

    if (!(nbreCandidatsParHeure > 0)) {
      return res.status(400).json({ message: "Invalid candidats par hour" });
    }

    const newPlannings = [];
    const existingPlannings = [];

    while (heureDebut.isBefore(heureFin) && candidateIds.length > 0) {
      const candidatesToSchedule = Math.min(
        nbreCandidatsParHeure,
        candidateIds.length
      );

      if (candidatesToSchedule > 0) {
        for (let i = 0; i < candidatesToSchedule; i++) {
          const candidatId = candidateIds.shift();
          const heureDebutClone = heureDebut.clone();

          const candidate = await Candidat.findOne({ _id: candidatId });

          if (candidate) {
            const existingPlanning = await Planning.findOne({
              candidat: candidatId,
            });

            if (existingPlanning) {
              existingPlanning.HeureDeb = heureDebut.format("HH:mm");
              existingPlanning.HeureFin = heureDebut
                .clone()
                .add(1, "hour")
                .format("HH:mm");
              existingPlanning.dateAudition = dateDebut.format("YYYY-MM-DD");
              await existingPlanning.save();

              existingPlannings.push({
                ...existingPlanning.toJSON(),
                mail: candidate.email,
              });
            } else {
              const sessionPlanning = new Planning({
                dateAudition: dateDebut.format("YYYY-MM-DD"),
                HeureDeb: heureDebut.format("HH:mm"),
                candidat: candidatId,
              });

              newPlannings.push(sessionPlanning);

              existingPlannings.push({
                ...sessionPlanning.toJSON(),
                mail: candidate.email,
              });
            }
          }
        }
      }

      heureDebut.add(1, "hour");
    }

    await Planning.insertMany(newPlannings);
    console.log(existingPlannings);
    await envoyerEmailAuxCandidats(existingPlannings);
    res.status(201).json({
      message: "Planning généré avec succès",
      planning: existingPlannings,
    });
  } catch (error) {
    console.error("Erreur lors de la génération du planning :", error);
    res.status(500).json({
      message: "Erreur lors de la génération du planning",
      error: error.message,
    });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayaghattas606@gmail.com",
    pass: "peew vcuf wmhd yvcf",
  },
});


const updateCandidatResultat = (req, res) => {
  Audition.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
  }).then((audition) => {
    if (!audition) {
      res.status(404).json({
        message: "objet non trouvé!",
      });
    } else {
      res.status(200).json({
        model: audition,
        message: "objet modifié!",
      });
    }
  });
};

const getCandidatsFiltres = async (req, res) => {
  try {
    const filtre = req.params.filtre;
    if (!["Accepté", "Refusé", "En Attente"].includes(filtre)) {
      return res
        .status(400)
        .json({
          message:
            "Filtre invalide. Utilisez 'Accepté', 'Refusé' ou 'En Attente'.",
        });
    }

    const auditions = await Audition.find({ résultat: filtre }).populate(
      "candidat"
    );
    const candidatsFiltres = auditions.map((audition) => audition.candidat);

    candidatsFiltres.sort((a, b) => {
      const resultatA = auditions.find((aud) =>
        aud.candidat.equals(a._id)
      ).résultat;
      const resultatB = auditions.find((aud) =>
        aud.candidat.equals(b._id)
      ).résultat;
      return (
        ["Accepté", "En Attente", "Refusé"].indexOf(resultatA) -
        ["Accepté", "En Attente", "Refusé"].indexOf(resultatB)
      );
    });

    res
      .status(200)
      .json({
        candidats: candidatsFiltres,
        message: `Liste des candidats avec le filtre '${filtre}'`,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        error: error.message,
        message: `Erreur lors de la récupération des candidats avec le filtre '${filtre}'`,
      });
  }
};

const getCandidatPupitreOrdonnes = async (req, res) => {
  try {
    // Récupérez les candidats du pupitre spécifié
    const candidats = await Audition.find({
      pupitre: req.body.pupitre,
    }).populate("candidat");

    // Triez les candidats par résultat (Accepté, En Attente, Refusé)
    const candidatsTries = candidats.sort((a, b) => {
      const resultatA = a.résultat || "En Attente";
      const resultatB = b.résultat || "En Attente";

      return (
        ["Accepté", "En Attente", "Refusé"].indexOf(resultatA) -
        ["Accepté", "En Attente", "Refusé"].indexOf(resultatB)
      );
    });

    // Initialisez la liste des résultats
    const resultats = [];

    // Parcourez les candidats triés
    candidatsTries.forEach((candidat) => {
      // Ajoutez les candidats acceptés à la liste
      if (candidat.résultat === "Accepté") {
        resultats.push(candidat);
      }

      // Ajoutez les candidats en attente à la liste
      else if (candidat.résultat === "En Attente") {
        resultats.push(candidat);
      }

      // Ajoutez les candidats refusés à la liste
      else {
        resultats.push(candidat);
      }
    });

    // Retournez la liste ordonnée
    const candidatsOrdonnes = resultats.map((audition) => ({
      candidat: audition.candidat,
      résultat: audition.résultat || "En Attente",
    }));

    res.status(200).json({
      model: candidatsOrdonnes,
      message:
        "Liste des candidats par pupitre triée par résultat récupérée avec succès!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Problème d'extraction des candidats par pupitre",
    });
  }
};

const creerChoriste = async (candidat) => {
  try {
    const audition = await Audition.findOne({ candidat: candidat._id });

    if (!audition) {
      throw new Error("Audition non trouvée pour le candidat.");
    }

    console.log(audition.pupitre)
    const nom= candidat.nom
    const prénom= candidat.prénom
    const pupitre= audition.pupitre
    const email= candidat.email
    const taille= candidat.taille
    const num_tel= candidat.num_tel
    const CIN= candidat.CIN
    const adresse= candidat.adresse
    const date_naiss= candidat.date_naiss
    const sexe= candidat.sexe
    const Taille= candidat.Taille
    await Candidat.findByIdAndDelete ({ _id: candidat._id})

    // Créer le Choriste avec les attributs du candidat
    const nouveauChoriste = new Choriste({
      nom: nom,
      prénom: prénom,
      pupitre: audition.pupitre,
      email: email,
      taille: taille,
      num_tel: num_tel,
      CIN: CIN,
      adresse: adresse,
      date_naiss: date_naiss,
      sexe: sexe,
      Taille: Taille,
    });
    // Enregistrez le Choriste dans la base de données
    await nouveauChoriste.save();

    // Créez un compte pour le Choriste
    const mdp = await genererMotDePasseAleatoire();
    console.log("Mot de passe non hashé :", mdp);

    // Hasher le mot de passe
    const mdpHash = await bcrypt.hash(mdp, 10);
    console.log("Mot de passe hashé :", mdpHash);

    // Créer le compte
    const nouveauCompte = new Compte({
      login: email,
      motDePasse: mdpHash,
    });
    await nouveauCompte.save();
    console.log("Compte enregistré avec succès:", nouveauCompte);

    // Associez l'ID du compte au champ 'compte' du Choriste
    nouveauChoriste.compte = nouveauCompte._id;

    // Enregistrez à nouveau le Choriste avec l'ID du compte associé
    await nouveauChoriste.save();

    await envoyerEmailLogin(candidat.email, candidat.email, mdp);
    console.log("E-mail de login envoyé avec succès.");

    return { choriste: nouveauChoriste, compte: nouveauCompte };
  } catch (error) {
    console.error("Erreur lors de la création du Choriste :", error);
    throw error;
  }
};

const envoyerEmailAcceptation = async (req, res) => {
  try {
    const candidatId = req.params.id;
    const candidat = await Candidat.findById(candidatId);

    if (!candidat) {
      return res.status(404).json({ message: "Candidat non trouvé" });
    }

    if (candidat.confirmation) {
      throw new Error("Le candidat est déjà confirmé");
    }

    const adresseEmail = candidat.email;
    const sujet = "Félicitations ! Vous avez été accepté à la chorale.";
    const file = path.join(__dirname, "../views/acceptationmail.ejs");
    const pdf = path.join(__dirname, "../files/Reglement.pdf");
    ejs.renderFile(
      file,
      {
        link: `http://localhost:5000/api/audition/confirmationCandidat/${candidatId}`,
      },
      async (err, data) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Erreur lors du rendu du fichier EJS." });
        }

        const mailOptions = {
          from: "ayaghattas606@gmail.com",
          to: adresseEmail,
          subject: sujet,
          html: data,
          attachments: [{ filename: "Reglement.pdf", path: pdf }],
        };

        await transporter.sendMail(mailOptions);
      }
    );

    res
      .status(200)
      .json({ message: "E-mail d'acceptation envoyé avec succès." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        error:
          "Erreur lors de la recherche du candidat dans la base de données.",
      });
  }
};

const confirmationCandidat = async (req, res) => {
  try {
    const candidat = await Candidat.findById(req.params.id);

    // Mettre à jour le candidat pour indiquer qu'il est confirmé
    if (candidat) {
      if (candidat.confirmation === false) {
        candidat.confirmation = true;
        await candidat.save();

        // Créer le Choriste
        const nouveauChoriste = await creerChoriste(candidat);
        console.log("Nouveau Choriste créé :", nouveauChoriste);

        // Supprimer le Candidat
        // await supprimerCandidat(candidat._id);
        // console.log("Candidat supprimé :", candidat._id);

        return res
          .status(200)
          .json({ message: "Candidat confirmé avec succès." });
      } else {
        return res
          .status(400)
          .json({ message: "Le candidat est déjà confirmé" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Le candidat non trouvé dans la base de données" });
    }
  } catch (error) {
    console.error("Erreur lors de la confirmation du candidat :", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la confirmation du candidat" });
  }
};

async function genererMotDePasseAleatoire() {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const longueurMotDePasse = 12;

  let mdp = "";
  for (let i = 0; i < longueurMotDePasse; i++) {
    const caractereAleatoire = caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
    mdp += caractereAleatoire;
  }
  return mdp;
}

const envoyerEmailLogin = async (adresseEmail, login, motDePasse) => {
  const sujet = "Information de connexion à la chorale";
  const file = path.join(__dirname, "../views/loginmail.ejs");
  const link = "http://localhost:5000/api/compte/login";

  try {
    const data = await ejs.renderFile(file, { login, motDePasse, link });

    const mailOptions = {
      from: "ayaghattas606@gmail.com",
      to: adresseEmail,
      subject: sujet,
      html: data,
    };

    await transporter.sendMail(mailOptions);
    console.log("E-mail de login envoyé avec succès.");
  } catch (err) {
    console.error(err);
    throw new Error("Erreur lors de l'envoi de l'e-mail de connexion.");
  }
};

module.exports = {
  addAudition,
  getAudition,
  fetchAudition,
  updateCandidatResultat,
  getCandidatsFiltres,
  getCandidatPupitreOrdonnes,
  envoyerEmailAcceptation,
  confirmationCandidat,
  updateAudition,
  deleteAudition,
  genererPlanning,
  fetchPlanning,
  fetchPlanningByid,
  fetchPlanningByCandidat,
  genererPlanningDefaillants,
  fetchPlanningByDateHeure,
};
