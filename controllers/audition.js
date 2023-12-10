const Audition = require("../models/audition");
const Candidat = require('../models/candidat');
const compteController = require('../controllers/compte');
const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ayaghattas606@gmail.com',
    pass: 'peew vcuf wmhd yvcf',
  },
});

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
    const audition = await newAudition.save();
    res.json(audition);
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

const getCandidatsFiltres = async (req, res) => {
  try {
    const filtre = req.params.filtre;
    if (!['Accepté', 'Refusé', 'En Attente'].includes(filtre)) {
      return res.status(400).json({ message: "Filtre invalide. Utilisez 'Accepté', 'Refusé' ou 'En Attente'." });
    }

    const auditions = await Audition.find({ résultat: filtre })
    .populate('candidat');
    const candidatsFiltres = auditions.map((audition) => audition.candidat);

    candidatsFiltres.sort((a, b) => {
      const resultatA = auditions.find((aud) => aud.candidat.equals(a._id)).résultat;
      const resultatB = auditions.find((aud) => aud.candidat.equals(b._id)).résultat;
      return ['Accepté', 'En Attente', 'Refusé'].indexOf(resultatA) - ['Accepté', 'En Attente', 'Refusé'].indexOf(resultatB);
    });

    res.status(200).json({ candidats: candidatsFiltres, message: `Liste des candidats avec le filtre '${filtre}'` });
  } catch (error) {
    res.status(500).json({ error: error.message, message: `Erreur lors de la récupération des candidats avec le filtre '${filtre}'` });
  }
};

const getCandidatPupitreOrdonnes = async (req, res) => {
  try {
    const pupitreNom = req.body.pupitreNom;

    // Récupérez les candidats du pupitre spécifié
    const candidats = await Candidat.find({ pupitre: pupitreNom });

    // Récupérez les auditions correspondantes
    const auditions = await Audition.find({ candidat: { $in: candidats.map(c => c._id) } }).populate('candidat');

    // Triez les candidats par résultat (Accepté, En Attente, Refusé)
    const candidatsOrdonnes = candidats.map((candidat) => {
      const audition = auditions.find((aud) => aud.candidat.equals(candidat._id));
      return { candidat, résultat: audition ? audition.résultat : 'En Attente' };
    });

    candidatsOrdonnes.sort((a, b) => {
      const resultatA = a.résultat || 'En Attente';
      const resultatB = b.résultat || 'En Attente';

      return ['Accepté', 'En Attente', 'Refusé'].indexOf(resultatA) - ['Accepté', 'En Attente', 'Refusé'].indexOf(resultatB);
    });

    res.status(200).json({
      model: candidatsOrdonnes,
      message: "Liste des candidats par pupitre triée par résultat récupérée avec succès!",
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
    // Créer le Choriste avec quelques attributs du candidat
    const nouveauChoriste = new Choriste({
      nom: candidat.nom,
      prenom: candidat.prenom,
      pupitre: candidat.pupitre,
      email: candidat.email,
    });

    // Enregistrez le Choriste dans la base de données
    await nouveauChoriste.save();

    return nouveauChoriste;
  } catch (error) {
    console.error('Erreur lors de la création du Choriste :', error);
    throw error;
  }
};

const supprimerCandidat = async (candidatId) => {
  try {
    // Supprimer le candidat de la base de données
    await Candidat.findByIdAndDelete(candidatId);
  } catch (error) {
    console.error('Erreur lors de la suppression du Candidat :', error);
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
      throw new Error('Le candidat est déjà confirmé');
    }

    const adresseEmail = candidat.email;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const sujet = "Félicitations ! Vous avez été accepté à la chorale.";
    const file = path.join(__dirname, "../views/acceptationmail.ejs");
    const pdf = path.join(__dirname, "../files/Reglement.pdf");

    ejs.renderFile(file, {
      name: req.body.nom + " " + req.body.prenom,
      link: "http://localhost:5000/api/acceptationmail/sauvegarderCandidat/" +
        req.body.nom + "/" +
        req.body.prenom + "/" +
        candidat.email,
    }, async (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur lors du rendu du fichier EJS." });
      }

      const mailOptions = {
        from: 'ayaghattas606@gmail.com',
        to: adresseEmail,
        subject: sujet,
        html: data,
        attachments: [
          { filename: 'Reglement.pdf', path: pdf },
        ],
      };

    await transporter.sendMail(mailOptions);

    // Mettre à jour le candidat pour indiquer qu'il est confirmé
    if (candidat.token === req.body.token) {
      candidat.confirmation = true;
      await candidat.save();
    }

     // Créer le Choriste
    const nouveauChoriste = await creerChoriste(candidat);
    console.log("Nouveau Choriste créé :", nouveauChoriste);

    // Supprimer le Candidat
    await supprimerCandidat(candidatId);
    console.log("Candidat supprimé :", candidatId);
    
    // Appeler la fonction pour créer le compte 
    await compteController.creerCompteChoriste(adresseEmail);
    console.log("Compte créé :", adresseEmail);
    
    return nouveauChoriste;
    });

    // Envoyer le deuxième email
    //await envoyerEmailLogin(req, res);

    res.status(200).json({ message: "E-mail d'acceptation envoyé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la recherche du candidat dans la base de données." });
  }
};

// const envoyerEmailLogin = async (req, res) => {
//   try {
//     const candidatId = req.params.id;
//     const candidat = await Candidat.findById(candidatId);

//     if (!candidat) {
//       return res.status(404).json({ message: "Candidat non trouvé" });
//     }

//     const adresseEmail = candidat.email;
//     const nom = req.body.nom;
//     const prenom = req.body.prenom;
//     const sujet = "Félicitations ! Vous avez confirmé votre adhésion à la chorale veuillez activer votre compte ";
//     const file = path.join(__dirname, "../views/loginmail.ejs");

//     // Générer un mot de passe aléatoire
//     const motDePasse = genererMotDePasseAleatoire();
//     // Hasher le mot de passe
//     const motDePasseHash = await hashMotDePasse(motDePasse);
//     // Mettre à jour le candidat avec le mot de passe haché
//     candidat.motDePasse = motDePasseHash;
//     await candidat.save();

//     ejs.renderFile(file, {
//       name: req.body.nom + " " + req.body.prenom,
//       link: "http://localhost:5000/api/loginmail/sauvegarderCandidat/" +
//         req.body.nom + "/" +
//         req.body.prenom + "/" +
//         candidat.email,
//     }, async (err, data) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: "Erreur lors du rendu du fichier EJS." });
//       }

//       const mailOptions = {
//         from: 'ayaghattas606@gmail.com',
//         to: adresseEmail,
//         subject: sujet,
//         html: data,
//       };

//       await transporter.sendMail(mailOptions);
//       candidat.confirmation = true;
//       await candidat.save();

//       res.status(200).json({ message: "E-mail de login envoyé avec succès." });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Erreur lors de la recherche du candidat dans la base de données." });
//   }
// };


module.exports = {
  addAudition,
  getAudition,
  fetchAudition,
  getCandidatsFiltres, 
  getCandidatPupitreOrdonnes,
  envoyerEmailAcceptation,
  //envoyerEmailLogin
};
