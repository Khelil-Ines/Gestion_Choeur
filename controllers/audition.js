// controllers/planningController.js
const mongoose = require('mongoose');
const Planning = require('../models/planning');
const Candidat = require('../models/candidat');
const nodemailer = require('nodemailer');
const moment = require('moment');

const genererEtEnregistrerPlanning = async (req, res, next) => {
  const { startDate, sessionStartTime, sessionEndTime, candidatesPerHour } = req.params;

  // Convertissez les valeurs au besoin
  let dateDebut = moment(startDate);
  let heureDebut = moment(sessionStartTime, 'HH:mm');
  let heureFin = moment(sessionEndTime, 'HH:mm');
  const nbreCandidatsParHeure = parseInt(candidatesPerHour);

  try {
    // Récupérez tous les candidats depuis votre modèle Candidat
    const candidats = await Candidat.find({}, '_id');

    const planning = [];

    while (candidats.length > 0) {
      // Si la plage horaire spécifiée pour une journée est terminée, passez à la journée suivante
      if (heureDebut.isSameOrAfter(heureFin)) {
        dateDebut = dateDebut.add(1, 'day');
        heureDebut = moment(sessionStartTime, 'HH:mm');
        heureFin = moment(sessionEndTime, 'HH:mm');
      }

      // Générez les plages horaires pour toute la journée
      while (heureDebut.isBefore(heureFin) && candidats.length > 0) {
        // Sélectionnez le nombre de candidats requis pour cette session
        const candidatsPourSession = candidats.splice(0, nbreCandidatsParHeure);

        candidatsPourSession.forEach((candidat, index) => {
          const sessionPlanning = new Planning({
            dateAudition: dateDebut.format('YYYY-MM-DD'),
            HeureDeb: heureDebut.format('HH:mm'),
            HeureFin: heureDebut.clone().add(1, 'hour').format('HH:mm'),
            candidat: candidat._id,
          });

          planning.push(sessionPlanning);

          // Si c'est le dernier candidat de la session, incrémente l'heure de début pour la prochaine session
          if (index === candidatsPourSession.length - 1) {
            heureDebut.add(1, 'hour');
          }
        });
      }
    }

    // Enregistrez le planning dans la base de données
    const planningEnregistre = await Planning.insertMany(planning);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ghofranemn22@gmail.com',
        pass: 'hgfr npar pidn zvje',
      }
    });

    try {
      // Parcourez le planning et envoyez un e-mail à chaque candidat
      for (const session of planning) {
        // Recherche du candidat par ID
        const candidatDetails = await Candidat.findOne({ "_id": session.candidat });

        // Vérifiez si l'e-mail du candidat est défini
        if (candidatDetails && candidatDetails.mail) {
          const destinataire = candidatDetails.mail;
          const sujet = 'Détails de votre audition';
          const texte = `Bonjour,\n\nVotre audition est prévue pour le ${moment(session.dateAudition).locale('fr').format('LL')} à ${session.HeureDeb}.\n\nCordialement,\nVotre Organisation`;

          // Envoie de l'e-mail
          await transporter.sendMail({
            from: 'ghofranemn22@gmail.com',
            to: destinataire,
            subject: sujet,
            text: texte,
          });

          console.log(`E-mail envoyé à ${destinataire} pour l'audition le ${session.dateAudition} à ${session.HeureDeb}`);
        } else {
          console.error("Aucun e-mail défini pour le candidat :", session.candidat);
        }
      }

      console.log('E-mails envoyés avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des e-mails :', error);
      throw new Error('Erreur lors de l\'envoi des e-mails');  // Rethrow l'erreur pour la gérer dans la fonction appelante
    } finally {
      transporter.close();
    }

    res.status(201).json({ message: 'Planning généré avec succès', planning: planningEnregistre });
  } catch (error) {
    console.error('Erreur lors de la génération du planning :', error);
    res.status(500).json({ message: 'Erreur lors de la génération du planning', error: error.message });
  }
};

const envoyerEmailAuxCandidats = async (planning) => {
  // Ajoutez le code pour envoyer des e-mails aux candidats si nécessaire
};

module.exports = {
  genererEtEnregistrerPlanning,
};
