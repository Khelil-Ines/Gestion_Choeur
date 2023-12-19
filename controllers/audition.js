const Audition = require("../models/audition");
const Candidat = require('../models/candidat');
const Choriste = require('../models/choriste');
const Compte = require('../models/compte');
const nodemailer = require('nodemailer');
const ejs = require("ejs");
const path = require("path");
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ayaghattas606@gmail.com',
    pass: 'peew vcuf wmhd yvcf',
  },
});


 


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

const deleteAudition = (req, res) => {
  Audition.deleteOne({ _id: req.params.id })
    .then((audition) => {
      if (!audition) {
        res.status(404).json({
          message: "Audition non supprimée!",
        });
      } else {
        res.status(200).json({
          model: audition,
          message: "Audition supprimée!",
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

const updateCandidatResultat = (req, res) => {
  Audition.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(
      (audition) => {
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
      }
    )
}

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

    // Récupérez les candidats du pupitre spécifié
    const candidats = await Audition.find({ pupitre: req.body.pupitre });
    console.log(candidats);

    // Récupérez les auditions correspondantes
    const auditions = await Audition.find({ candidat: { $in: candidats.map(c => c._id) } })
    .populate('candidat');

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
    const audition = await Audition.findOne({ candidat: candidat._id });

    if (!audition) {
      throw new Error('Audition non trouvée pour le candidat.');
    }
    const nom= candidat.nom
    const prénom= candidat.prénom
    const pupitre= audition.pupitre
    const mail= candidat.mail
    const taille= candidat.taille
    const num_tel= candidat.num_tel
    const CIN= candidat.CIN
    const adresse= candidat.adresse
    const date_naiss= candidat.date_naiss
    const sexe= candidat.sexe

    await Candidat.findByIdAndDelete ({ _id: candidat._id})
    // Créer le Choriste avec les attributs du candidat
    const nouveauChoriste = new Choriste({
      nom: nom,
      prénom: prénom,
      pupitre: audition.pupitre,
      mail: mail,
      taille: taille,
      num_tel: num_tel,
      CIN: CIN,
      adresse: adresse,
      date_naiss: date_naiss,
      sexe: sexe,
    });
    // Enregistrez le Choriste dans la base de données
    await nouveauChoriste.save();
    
// Créez un compte pour le Choriste
const mdp = await genererMotDePasseAleatoire();
console.log('Mot de passe non hashé :', mdp);

// Hasher le mot de passe
const mdpHash = await bcrypt.hash(mdp, 10);
console.log('Mot de passe hashé :', mdpHash);

// Créer le compte
const nouveauCompte = new Compte({
  login: mail,
  motDePasse: mdpHash,

});
await nouveauCompte.save();
console.log("Compte enregistré avec succès:", nouveauCompte);

    // Associez l'ID du compte au champ 'compte' du Choriste
    nouveauChoriste.compte = nouveauCompte._id;
    
    // Enregistrez à nouveau le Choriste avec l'ID du compte associé
    await nouveauChoriste.save();

    await envoyerEmailLogin(candidat.mail, candidat.mail, mdp);
    console.log("E-mail de login envoyé avec succès.");

    return { choriste: nouveauChoriste, compte: nouveauCompte } ;
    
  } catch (error) {
    console.error('Erreur lors de la création du Choriste :', error);
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

    const adresseEmail = candidat.mail;
    const sujet = "Félicitations ! Vous avez été accepté à la chorale.";
    const file = path.join(__dirname, "../views/acceptationmail.ejs");
    const pdf = path.join(__dirname, "../files/Reglement.pdf");
    ejs.renderFile(file, {
      link: `http://localhost:5000/api/audition/confirmationCandidat/${candidatId}` }, 
      async (err, data) => {
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

    });

    res.status(200).json({ message: "E-mail d'acceptation envoyé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la recherche du candidat dans la base de données." });
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

        return res.status(200).json({ message: "Candidat confirmé avec succès." });
      } else {
        return res.status(400).json({ message: "Le candidat est déjà confirmé" });
      }
    } else {
      return res.status(400).json({ message: "Le candidat non trouvé dans la base de données" });
    }
  } catch (error) {
    console.error('Erreur lors de la confirmation du candidat :', error);
    return res.status(500).json({ error: "Erreur lors de la confirmation du candidat" });
  }
};

async function genererMotDePasseAleatoire() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const longueurMotDePasse = 12;

  let mdp = '';
  for (let i = 0; i < longueurMotDePasse; i++) {
    const caractereAleatoire = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
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
      from: 'ayaghattas606@gmail.com',
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
  deleteAudition
};
