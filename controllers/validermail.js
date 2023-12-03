require("dotenv").config();
var nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const Candidat = require("../models/candidat");

//Récuperer email et envoyer un email
const envoyerMail = (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.PASSWORD_ACCOUNT,
    },
  });

  var mailOptions = {
    from: "asmabouziri299@gmail.com",
    to: email,
    subject: "Welcome !",
    html: "<h1>welcome " + nom + " " + prenom + " !</h1>",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send({ msg: "email sent" });
    }
  });
};

//envoyer un email pour valider l'email
const envoyerValidationMail = (req, res) => {
  const email = req.params.email;
  console.log(email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.PASSWORD_ACCOUNT,
    },
  });

  const file = path.join(__dirname, "../views/confirmmail.ejs"); // Chemin absolu vers le fichier EJS
  const topic = "Welcome !";

  ejs
    .renderFile(file, {
      name: req.body.nom + " " + req.body.prenom,
      link:
        "http://localhost:5000/api/validermail/sauvegarderCandidat/" +
        req.body.nom +
        "/" +
        req.body.prenom +
        "/" +
        email,
    })
    .then((resultat) => {
      const mailOptions = {
        from: process.env.EMAIL_ACCOUNT,
        to: email,
        subject: topic,
        html: resultat,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log("Error: " + error);
          res.status(500).send({ error: error.message });
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).send({ msg: "email sent" });
        }
      });
    })
    .catch((err) => {
      console.error("Error rendering EJS: " + err);
      res.status(500).send({ error: "Error rendering EJS" });
    });
};

//valider l'email et enregistrer le condidat
const ValiderEtSauvgarder = (req, res) => {
  const email = req.params.email;
  console.log(email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.PASSWORD_ACCOUNT,
    },
  });

  const cand = new Candidat({
    nom: req.params.nom,
    prenom: req.params.prenom,
    email: req.params.email,
  });
  console.log(cand);
  cand
    .save()
    .then(() => {
      res.status(201).json({
        model: cand,
        message: "Candidat ajouté!",
      });
      var mailOptions = {
        from: "asmabouziri299@gmail.com",
        to: email,
        subject: "OSC Candidature",
        html: "Votre candidature est bien sauvegardé !",
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).send({ msg: "email sent" });
        }
      });
    })
    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "Données invalides!",
      });
    });
};

module.exports = { envoyerMail, envoyerValidationMail, ValiderEtSauvgarder };
