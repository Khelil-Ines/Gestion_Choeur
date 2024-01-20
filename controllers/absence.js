const Choriste = require("../models/choriste");
const Utilisateur = require("../models/utilisateur");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const cron = require("node-cron");
const Absence = require("../models/absence");
const Repetition = require("../models/repetition");
const Concert = require("../models/concert");
const Compte = require("../models/compte");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayaghattas606@gmail.com",
    pass: "peew vcuf wmhd yvcf",
  },
});

exports.envoyerEmailElimination = async (req, res) => {
  try {
    // Récupérez tous les choristes ayant le statut "éliminé"
    const choristesElimines = await Choriste.find({
      statut: { $in: ["Eliminé", "Eliminé_Discipline"] },
    });

    // Vérifiez s'il y a des choristes éliminés
    if (choristesElimines.length === 0) {
      return res.status(404).json({ message: "Aucun choriste éliminé trouvé" });
    } else {
      for (const choristeElimine of choristesElimines) {
        const sujet = "Elimination ! ";

        const mailOptions = {
          from: transporter.user,
          to: choristeElimine.email,
          subject: sujet,
          html: "<p> Vous avez dépassé le seuil d'absence ! Vous avez été éliminé du choral. </p>",
        };

        await transporter.sendMail(mailOptions);

        res
          .status(200)
          .json({ message: "E-mail d'élimination envoyé avec succès." });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
  }
};

exports.envoyerEmailNomination = async (req, res) => {
  try {
    // Récupérez tous les choristes ayant le statut "Nominé"
    const choristesNomines = await Choriste.find({ statut: "Nominé" });

    // Vérifiez s'il y a des choristes nominés
    if (choristesNomines.length === 0) {
      return res.status(404).json({ message: "Aucun choriste nominé trouvé" });
    } else {
      for (const choristeNomine of choristesNomines) {
        const sujet = "Nomination ! ";

        const mailOptions = {
          from: transporter.user,
          to: choristeNomine.email,
          subject: sujet,
          html: "<p> Vous allez bientôt dépasser le seuil d'absence ! Vous risquez l'élimination. </p>",
        };

        await transporter.sendMail(mailOptions);

        res
          .status(200)
          .json({ message: "E-mail de nomination envoyé avec succès." });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
  }
};

exports.updateSeuilElimination = async (req, res) => {
  try {
    seuilNomination = req.body.nouveauSeuil;
    Absence.seuilNomination = seuilNomination;

    // Enregistrez les modifications dans la base de données
    await Absence.save();
  } catch (error) {
    res.status(200).json({ message: "Seuil mis à jour avec succès" });
  }
}
 

// Schedule a cron job to send notifications periodically
cron.schedule('0 0 * * *', async () => {
  try {
    // Query the database for choristes with a specific status and starting today
    const choristesElimine = await Choriste.find({
      'historiqueStatut.statut': 'Eliminé',
      'historiqueStatut.date': {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(24, 0, 0, 0),
      },
    });

    const choristesNomine = await Choriste.find({
      'historiqueStatut.statut': 'Nominé',
      'historiqueStatut.date': {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(24, 0, 0, 0),
      },
    });

    // Emit notifications for choristes Eliminé today
    choristesElimine.forEach((choriste) => {
      if (choriste.historiqueStatut.length > 0) {
        const latestStatus = choriste.historiqueStatut[choriste.historiqueStatut.length - 1].statut;
        console.log(`Choriste ${choriste.nom} is currently ${latestStatus}.`);
        // Emit the event to the specified room
        if (req.io) {
          req.io.to('updateNotificationsRoom').emit('notificationStatus', {
            type: 'statusChanged',
            message: `Choriste ${choriste.nom} est maintenant ${latestStatus}.`,
          });
        }
      }
    });

    // Emit notifications for choristes Nominé today
    choristesNomine.forEach((choriste) => {
      if (choriste.historiqueStatut.length > 0) {
        const latestStatus = choriste.historiqueStatut[choriste.historiqueStatut.length - 1].statut;
        console.log(`Choriste ${choriste.nom} is currently ${latestStatus}.`);
        // Emit the event to the specified room
        if (req.io) {
          req.io.to('updateNotificationsRoom').emit('notificationStatus', {
            type: 'statusChanged',
            message: `Choriste ${choriste.nom} est maintenant ${latestStatus}.`,
          });
        }
      }
    });

    console.log('Notification cron job executed.');
  } catch (error) {
    console.error('Error in the cron job:', error);
  }
});


exports.declarerAbsenceRepetition = async (req, res) => {
  try {
    // Find the latest répétition
    const latestRepetition = await Repetition.findOne().sort({ date: -1 });

    if (!latestRepetition) {
      console.error("No repetition found.");
      return res.status(404).json({ error: "Aucune répétition trouvé." });
    }

    if (
      !latestRepetition.liste_Abs ||
      latestRepetition.liste_Abs.length === 0
    ) {
      console.error("Liste_Abs is empty.");
      return res.status(400).json({ error: "Liste_Abs est vide." });
    }

    for (const choristeId of latestRepetition.liste_Abs) {
      const choriste = await Choriste.findById(choristeId);
      //const choriste = await Choriste.findOne({ compte: req.auth.compteId });

      if (!choriste) {
        console.error(`Choriste with ID ${choristeId} not found.`);
        continue; // Move to the next iteration if choriste not found
      }

      // Incrémenter le compteur d'absences
      choriste.nbr_absences++;

      // Créer une nouvelle absence
      const newAbsence = new Absence({
        Type: "Repetition",
        raison: "Non spécifiée !",
        Date: latestRepetition.date,
      });
      console.log("New absence created:", newAbsence);
      // Enregistrer l'absence dans la base de données
      const savedAbsence = await newAbsence.save();

      // Ajouter l'absence à la liste des absences du choriste
      choriste.absences.push(savedAbsence._id);

      console.log(choriste.absence);
      // Mettre à jour le statut en fonction des nouvelles règles
      if (choriste.nbr_absences > Absence.seuilNomination) {
        choriste.statut = "Eliminé";
        const compteId = choriste.compte;
        Compte.findOneAndDelete({ _id: compteId });
        choriste.compte = null;
        choriste.historiqueStatut.push({
          statut: choriste.statut,
          date: latestRepetition.date,
        });
      } else if (choriste.nbr_absences === Absence.seuilNomination) {
        choriste.statut = "Nominé";
        choriste.historiqueStatut.push({
          statut: choriste.statut,
          date: latestRepetition.date,
        });
      }

      // Enregistrer les modifications dans la base de données
      const savedChoriste = await choriste.save();
      Utilisateur.choriste = savedChoriste;

      console.log(
        `Absence déclarée pour le choriste ${choriste.nom} ${choriste.prénom}. Nouveau statut : ${choriste.statut}`
      );
      return res
        .status(201)
        .json({
          message: "Absences repetition créées avec succès.",
          choriste: savedChoriste,
        });
    }
    // Send the response once all choristes are processed
  } catch (error) {
    console.error("Erreur lors de la déclaration de l'absence :", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la déclaration de l'absence" });
  }
};

exports.declarerAbsenceConcert = async (req, res) => {
  try {
    // Find the latest concert
    const latestConcert = await Concert.findOne().sort({ date: -1 });

    if (!latestConcert) {
      console.error("No concert found.");
      return res.status(404).json({ error: "Aucun concert trouvé." });
    }

    if (!latestConcert.liste_Abs || latestConcert.liste_Abs.length === 0) {
      console.error("Liste_Abs is empty.");
      return res.status(400).json({ error: "Liste_Abs est vide." });
    }

    for (const choristeId of latestConcert.liste_Abs) {
      const choriste = await Choriste.findById(choristeId);

      if (!choriste) {
        console.error(`Choriste with ID ${choristeId} not found.`);
        continue; // Move to the next iteration if choriste not found
      }

      // Incrémenter le compteur d'absences
      choriste.nbr_absences++;

      // Créer une nouvelle absence
      const newAbsence = new Absence({
        Type: "Concert",
        raison: "Non spécifiée !",
        Date: latestConcert.date,
      });

      // Enregistrer l'absence dans la base de données
      const savedAbsence = await newAbsence.save();

      // Ajouter l'absence à la liste des absences du choriste
      choriste.absences.push(savedAbsence._id);

      // Mettre à jour le statut en fonction des nouvelles règles
      if (choriste.nbr_absences > Absence.seuilNomination) {
        const compteId = choriste.compte;
        Compte.findOneAndDelete({ _id: compteId });
        choriste.compte = null;
        choriste.statut = "Eliminé";
        choriste.historiqueStatut.push({
          statut: choriste.statut,
          date: latestConcert.date,
        });
      } else if (choriste.nbr_absences == Absence.seuilNomination) {
        choriste.statut = "Nominé";
        choriste.historiqueStatut.push({
          statut: choriste.statut,
          date: latestConcert.date,
        });
      }

      // Enregistrer les modifications dans la base de données
      savedChoriste = await choriste.save();
      Utilisateur.choriste = savedChoriste;

      console.log(
        `Absence déclarée pour le choriste ${choriste.nom} ${choriste.prénom}. Nouveau statut : ${choriste.statut}`
      );
    }

    // Send the response once all choristes are processed
    return res
      .status(201)
      .json({
        message: "Absences concert créées avec succès.",
        choriste: savedChoriste,
      });
  } catch (error) {
    console.error("Erreur lors de la déclaration de l'absence :", error);
    return res
      .status(500)
      .json({ error: "Erreur lors de la déclaration de l'absence" });
  }
};

// const declarationConcert = cron.schedule('30 23 * * *', async () => {
//   try {
//     // Find the latest concert
//     const latestConcert = await Concert.findOne().sort({ date: -1 });

//     if (!latestConcert) {
//       console.error('No concert found.');
//     }

//     if (!latestConcert.liste_Abs || latestConcert.liste_Abs.length === 0) {
//       console.error('Liste_Abs is empty.');
//     }

//     for (const choristeId of latestConcert.liste_Abs) {
//       const choriste = await Choriste.findById(choristeId);

//       if (!choriste) {
//         console.error(`Choriste with ID ${choristeId} not found.`);
//         continue; // Move to the next iteration if choriste not found
//       }

//       // Incrémenter le compteur d'absences
//       choriste.nbr_absences++;

//       // Créer une nouvelle absence
//       const newAbsence = new Absence({
//         Type: "Concert",
//         raison: "Non spécifiée !",
//         Date: latestConcert.date,
//       });

//       // Enregistrer l'absence dans la base de données
//       const savedAbsence = await newAbsence.save();

//       // Ajouter l'absence à la liste des absences du choriste
//       choriste.absences.push(savedAbsence._id);

//       // Mettre à jour le statut en fonction des nouvelles règles
//       if (choriste.nbr_absences > Absence.seuilNomination) {
//         choriste.statut = "Eliminé";
//         choriste.historiqueStatut.push({
//           statut: choriste.statut,
//           date: latestConcert.date,
//         });
//       } else if (choriste.nbr_absences == Absence.seuilNomination) {
//         choriste.statut = "Nominé";
//         choriste.historiqueStatut.push({
//           statut: choriste.statut,
//           date: latestConcert.date,
//         });
//       }

//       // Enregistrer les modifications dans la base de données
//       savedChoriste = await choriste.save();
//       Utilisateur.choriste = savedChoriste;

//       console.log(
//         `Absence déclarée pour le choriste ${choriste.nom} ${choriste.prénom}. Nouveau statut : ${choriste.statut}`
//       );
//     }

//     // Send the response once all choristes are processed
//     console.log('Absences concert créées avec succès.');
//   } catch (error) {
//     console.error("Erreur lors de la déclaration de l'absence :", error);
//   }
// });

// declarationConcert.start();

// const declarationRepetition = cron.schedule('30 23 * * *', async () => {
//   try {
//     // Find the latest répétition
//     const latestRepetition = await Repetition.findOne().sort({ date: -1 });

//     if (!latestRepetition) {
//       console.error('No repetition found.');
//     }

//     if (!latestRepetition.liste_Abs || latestRepetition.liste_Abs.length === 0) {
//       console.error('Liste_Abs is empty.');
//     }

//     for (const choristeId of latestRepetition.liste_Abs) {
//       const choriste = await Choriste.findById(choristeId);

//       if (!choriste) {
//         console.error(`Choriste with ID ${choristeId} not found.`);
//         continue; // Move to the next iteration if choriste not found
//       }

//       // Incrémenter le compteur d'absences
//       choriste.nbr_absences++;

//       // Créer une nouvelle absence
//       const newAbsence = new Absence({
//         Type: "Repetition",
//         raison: "Non spécifiée !",
//         Date: latestRepetition.date,
//       });
//       console.log("New absence created:", newAbsence);
//       // Enregistrer l'absence dans la base de données
//       const savedAbsence = await newAbsence.save();

//       // Ajouter l'absence à la liste des absences du choriste
//       choriste.absences.push(savedAbsence._id);

//       // Mettre à jour le statut en fonction des nouvelles règles
//       if (choriste.nbr_absences > Absence.seuilNomination) {
//         choriste.statut = "Eliminé";
//         choriste.historiqueStatut.push({
//           statut: choriste.statut,
//           date: latestRepetition.date,
//         });
//       } else if (choriste.nbr_absences == Absence.seuilNomination) {
//         choriste.statut = "Nominé";
//         choriste.historiqueStatut.push({
//           statut: choriste.statut,
//           date: latestRepetition.date,
//         });
//       }

//       // Enregistrer les modifications dans la base de données
//       const savedChoriste = await choriste.save();
//       Utilisateur.choriste = savedChoriste;

//       console.log(
//         `Absence déclarée pour le choriste ${choriste.nom} ${choriste.prénom}. Nouveau statut : ${choriste.statut}`
//       );
//       console.log('Absences repetition créées avec succès.');

//     }
//     // Send the response once all choristes are processed
//   } catch (error) {
//     console.error("Erreur lors de la déclaration de l'absence :", error);
//   }
// });

// declarationRepetition.start();

exports.getAbsencesChoriste = async (req, res) => {
  try {
    const choriste = await Choriste.findById(req.params.id).populate(
      "absences"
    );
    if (!choriste) {
      return res.status(404).json({ message: "Choriste non trouvé" });
    }
    const absences = choriste.absences;
    return res.status(200).json({ absences });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des absences." });
  }
};

exports.EliminerDiscipline = async (req, res) => {
  Choriste.findOne({ _id: req.params.id }).then((choriste) => {
    if (!choriste) {
      res.status(404).json({
        message: "Choriste non trouvé!",
      });
    } else {
      const compteId = choriste.compte;
      console.log("Compte ID :", compteId);
      Compte.findOneAndDelete({ _id: compteId });
      choriste.compte = null;
      console.log("Compte deleted!");
      choriste.statut = "Eliminé_Discipline";
      choriste.save();
      console.log("Choriste Eliminé pour des raisons disciplinaires!");
      res.status(200).json({
        message: "Choriste Eliminé pour des raisons disciplinaires!",
      });
    }
  });
};

exports.getElimines = async (req, res) => {
  try {
    const ChoristesElimines = await Choriste.find({
      statut: { $in: ["Eliminé", "Eliminé_Discipline"] },
    });
    if (!ChoristesElimines.length === 0) {
      return res.status(200).json({ message: "Aucun choriste nominé trouvé" });
    } else {
      return res.status(200).json({ ChoristesElimines });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des éliminés." });
  }
};

exports.getNomines = async (req, res) => {
  try {
    const ChoristesNominees = await Choriste.find({ statut: "Nominé" });
    if (!ChoristesNominees.length === 0) {
      return res.status(200).json({ ChoristesNominees });
    } else {
      return res.status(200).json({ message: "Aucun choriste nominé trouvé" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des Nominés." });
  }
};

exports.addAbsence = async (req, res) => {
  try {
    const choriste = await Choriste.findOne({ compte: req.auth.compteId });
    const { Type, raison, Date } = req.body;

    const newAbsence = new Absence({ Type, raison, Date });

    const savedAbsence = await newAbsence.save();

    choriste.absences.push(savedAbsence._id);

    choriste.nbr_absences++;
    console.log(choriste.nbr_absences);

    await choriste.save();

    res.status(201).json({ choriste, absence: savedAbsence });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'absence :", error);
    res.status(500).json({ error: "Échec de la création de l'absence." });
  }
};
