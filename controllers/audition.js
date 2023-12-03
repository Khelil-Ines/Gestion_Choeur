const Audition = require("../models/audition");
const Candidat = require('../models/candidat');
const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require("path");


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
  
 

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'ayaghattas606@gmail.com',
          pass: 'peew vcuf wmhd yvcf',
        },
      });
      
      const envoyerEmailAcceptation = (req, res) => {
        const candidatId = req.params.id;
      
        Candidat.findById(candidatId)
          .then((candidat) => {
            if (!candidat) {
              return res.status(404).json({
                message: "Candidat non trouvé",
              });
            }
      
            const adresseEmail = candidat.email;
            const nom = req.body.nom;
            const prenom = req.body.prenom;
            const sujet = "Félicitations ! Vous avez été accepté à la chorale.";
            const file = path.join(__dirname, "../views/acceptationmail.ejs");
            const pdf = path.join(__dirname, "../files/Reglement.pdf");
      
            // Utilisez ejs.renderFile avec une fonction de rappel
            ejs.renderFile(file, {
              name: req.body.nom + " " + req.body.prenom,
              link: "http://localhost:5000/api/acceptationmail/sauvegarderCandidat/" +
                req.body.nom + "/" +
                req.body.prenom + "/" +
                candidat.email,
            }, (err, data) => {
              if (err) {
                console.error(err);
                return res.status(500).json({
                  error: "Erreur lors du rendu du fichier EJS.",
                });
              }
      
              const mailOptions = {
                from: 'ayaghattas606@gmail.com',
                to: adresseEmail,
                subject: sujet,
                html: data, // Utiliser le contenu généré à partir du fichier ejs
                attachments: [
                  {
                    filename: 'Reglement.pdf',
                    path:pdf,
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
                candidat.confirmation = true;
                candidat.save();
                  return res.status(200).json({
                    message: "E-mail d'acceptation envoyé avec succès.",
                  });
                }
              });
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
    addAudition,
    getAudition,
    fetchAudition,
    getCandidatsFiltres, 
    envoyerEmailAcceptation
  }