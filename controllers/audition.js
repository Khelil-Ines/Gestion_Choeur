const Audition = require("../models/audition");
const Candidat = require('../models/candidat');
const nodemailer = require('nodemailer');



const fetchAudition = (req, res) => {
    Audition.findOne({ _id: req.params.id })
    .populate('candidat')
    .then((audition) => {
      if (!audition) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
          model: audition,
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
const addAudition = (req, res) => { 
    const newAudition = new Audition(req.body);
    newAudition.save()
        .then(audition => {
            res.json(audition);
        })
        .catch(err => {
            res.status(400).json({ erreur: 'Échec de la création du l\'audition' });
        });
  }
  const getAudition = (req, res) => {
    Audition.find()
    .populate('candidat')
    .then((auditions) => {
      res.status(200).json({
        model: auditions,
        message: "success"
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
        message: "problème d'extraction"
      });
    });
  }

  
   
      const getCandidatsFiltres = (req, res) => {
        const filtre = req.params.filtre; // Utilisez la valeur directement sans conversion en minuscules
      
        // Vérifiez que le filtre est valide
        if (!['Accepté', 'Refusé', 'En Attente'].includes(filtre)) {
          return res.status(400).json({
            message: "Filtre invalide. Utilisez 'Accepté', 'Refusé' ou 'En Attente'.",
          });
        }
      
        // Utilisez le modèle Audition pour trouver toutes les auditions avec le résultat spécifié
        Audition.find({ résultat: filtre })
          .populate('candidat')
          .then((auditions) => {
            // Mappez les candidats à partir des auditions
            const candidatsFiltres = auditions.map((audition) => audition.candidat);
      
            res.status(200).json({
              candidats: candidatsFiltres,
              message: `Liste des candidats avec le filtre '${filtre}'`,
            });
          })
          .catch((error) => {
            res.status(500).json({
              error: error.message,
              message: `Erreur lors de la récupération des candidats avec le filtre '${filtre}'`,
            });
          });
      };
  
 

      // Configurer le transporteur (Gmail dans cet exemple)
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ayaghattas606@gmail.com',
            pass: 'peew vcuf wmhd yvcf',
        },
      });
      
      // Fonction pour envoyer un e-mail d'acceptation
      const envoyerEmailAcceptation = (req, res) => {
        const candidatId = req.params.id;
      
        // Recherchez le candidat dans la base de données
        Candidat.findById(candidatId)
          .then((candidat) => {
            if (!candidat) {
              return res.status(404).json({
                message: "Candidat non trouvé",
              });
            }
      
            // L'e-mail du candidat a été trouvé, envoyez l'e-mail d'acceptation
            const adresseEmail = candidat.email;
            const sujet = "Félicitations ! Vous avez été accepté à la chorale.";
            const contenu = "Cher candidat,\n\nFélicitations ! Nous sommes ravis de vous informer que vous avez été accepté à la chorale. Bienvenue dans notre communauté musicale.\n\nCordialement,\nL'équipe de la chorale";
      
            const mailOptions = {
              from: 'ayaghattas606@gmail.com',
              to: adresseEmail,
              subject: sujet,
              text: contenu,
              attachments: [
                {
                  filename: 'nom_de_la_piece_jointe.txt', // Nom de la pièce jointe
                  content: 'Contenu de la pièce jointe ici', // Contenu de la pièce jointe
                },
              ],
            };
      
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.error(error);
                return res.status(500).json({
                  error: "Erreur lors de l'envoi de l'e-mail d'acceptation.",
                });
              } else {
                console.log('E-mail d\'acceptation envoyé: ' + info.response);
                return res.status(200).json({
                  message: "E-mail d'acceptation envoyé avec succès.",
                });
              }
            });
          })
          .catch((error) => {
            console.error(error);
            return res.status(500).json({
              error: "Erreur lors de la recherche du candidat dans la base de données.",
            });
          });
      };
      
      module.exports = {
        envoyerEmailAcceptation,
      };
      
      
  
  
  module.exports = {
    addAudition,
    getAudition,
    fetchAudition,
    getCandidatsFiltres, 
    envoyerEmailAcceptation
  }