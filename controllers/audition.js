const Planning = require("../models/audition");
const Candidat = require("../models/candidat");
const nodemailer = require("nodemailer");
const moment = require("moment");

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
        if (candidatDetails && candidatDetails.mail) {
          const destinataire = candidatDetails.mail;
          const sujet = "Détails de votre audition";
          const texte = `Bonjour,\n\nVotre audition est prévue pour le ${moment(
            session.dateAudition
          )
            .locale("fr")
            .format("LL")} à ${
            session.HeureDeb
          }.\n\nCordialement,\nVotre Organisation`;

          // Envoie de l'e-mail
          await transporter.sendMail({
            from: "ghofranemn22@gmail.com",
            to: destinataire,
            subject: sujet,
            text: texte,
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
      throw new Error("Erreur lors de l'envoi des e-mails"); // Rethrow l'erreur pour la gérer dans la fonction appelante
    } finally {
      transporter.close();
    }

    res
      .status(201)
      .json({
        message: "Planning généré avec succès",
        planning: planningEnregistre,
      });
  } catch (error) {
    console.error("Erreur lors de la génération du planning :", error);
    res
      .status(500)
      .json({
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
    return res
      .status(400)
      .json({
        error:
          "Le nom du candidat est requis en tant que paramètre de requête.",
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

const envoyerEmailAuxCandidats = async (
  candidatIds,
  dateAudition,
  heureAudition
) => {
  let transporter;

  try {
    // Recherche des candidats par ID
    const candidatsDetails = await Candidat.find({ _id: { $in: candidatIds } });

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ghofranemn22@gmail.com",
        pass: "hgfr npar pidn zvje",
      },
    });

    for (const candidatDetails of candidatsDetails) {
      // Vérifiez si l'e-mail du candidat est défini
      if (candidatDetails && candidatDetails.mail) {
        const destinataire = candidatDetails.mail;
        const sujet = "Détails de votre nouvelle audition";
        const texte = `Bonjour,\n\nVotre nouvelle audition est prévue pour le ${dateAudition} à ${heureAudition}.\n\nCordialement,\nVotre Organisation`;

        // Envoi de l'e-mail
        await transporter.sendMail({
          from: "ghofranemn22@gmail.com",
          to: destinataire,
          subject: sujet,
          text: texte,
        });

        console.log(
          `E-mail envoyé à ${destinataire} pour l'audition le ${dateAudition} à ${heureAudition}`
        );
      } else {
        console.error("Aucun e-mail défini pour le candidat :", candidatDetails._id);
      }
    }

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

//generer planning pour les defaillants
const genererPlanningDefaillants = async (req, res, next) => {
  const {
    startDate,
    sessionStartTime,
    sessionEndTime,
    candidatesPerHour,
    candidateIds,
  } = req.body;

  // Convertissez les valeurs au besoin
  let dateDebut = moment(startDate);
  let heureDebut = moment(sessionStartTime, "HH:mm");
  let heureFin = moment(sessionEndTime, "HH:mm");
  const nbreCandidatsParHeure = parseInt(candidatesPerHour);

  try {
    // Vérifiez si des ID de candidats sont fournis dans le corps de la requête
    if (!candidateIds || candidateIds.length === 0) {
      return res.status(400).json({ message: "Aucun ID de candidat fourni." });
    }

    const planning = [];

    while (heureDebut.isBefore(heureFin) && candidateIds.length > 0) {
      const candidatesToSchedule = Math.min(
        nbreCandidatsParHeure,
        candidateIds.length
      );

      if (candidatesToSchedule > 0) {
        console.log(
          `Scheduling ${candidatesToSchedule} candidate(s) for ${heureDebut.format(
            "HH:mm"
          )}`
        );

        for (let i = 0; i < candidatesToSchedule; i++) {
          const candidatId = candidateIds.shift();
          const heureDebutClone = heureDebut.clone(); // Utiliser une copie figée

          // Vérifiez si un planning existe pour ce candidat
          const existingPlanning = await Planning.findOne({
            candidat: candidatId,
          });

          if (existingPlanning) {
            console.log(`Mise à jour pour candidat ${candidatId}`);
            // Mettez à jour l'heure de début et la date d'audition avec celles de la nouvelle session
            existingPlanning.HeureDeb = heureDebut.format("HH:mm");
            existingPlanning.HeureFin = heureDebut
              .clone()
              .add(1, "hour")
              .format("HH:mm");
            existingPlanning.dateAudition = dateDebut.format("YYYY-MM-DD");
            await existingPlanning.save();
          } else {
            console.log(`Nouvelle session pour candidat ${candidatId}`);
            // Ajoutez une nouvelle entrée dans le planning
            const sessionPlanning = new Planning({
              dateAudition: dateDebut.format("YYYY-MM-DD"),
              HeureDeb: heureDebut.format("HH:mm"),
              candidat: candidatId,
            });

            planning.push(sessionPlanning);
          }

          console.log(
            `Candidate ${candidatId} scheduled for ${heureDebut.format(
              "HH:mm"
            )} on ${dateDebut.format("YYYY-MM-DD")}`
          );
        }
      }

      // Incrémente l'heure de début pour la prochaine session
      heureDebut.add(1, "hour");
    }

    const planningEnregistre = await Planning.insertMany(planning);
    console.log(candidateIds);
    await envoyerEmailAuxCandidats(
      candidateIds,
      dateDebut.format("YYYY-MM-DD"),
      heureFin.format("HH:mm")
    );
    res
      .status(201)
      .json({
        message: "Planning généré avec succès",
        planning: planningEnregistre,
      });
  } catch (error) {
    console.error("Erreur lors de la génération du planning :", error);
    res
      .status(500)
      .json({
        message: "Erreur lors de la génération du planning",
        error: error.message,
      });
  }
};

module.exports = {
  genererPlanning,
  fetchPlanning,
  fetchPlanningByid,
  fetchPlanningByCandidat,
  genererPlanningDefaillants,
  fetchPlanningByDateHeure,
};
