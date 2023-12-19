const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Candidat = require("../models/candidat");
const path = require("path");
const ejs = require("ejs");

const envoyerMailValidation = (req, res) => {
  const nom = req.body.nom;
  const prenom = req.body.prenom;
  const email = req.body.email;

  const token = jwt.sign({ id: Candidat._id }, "secretKey", {
    expiresIn: "5m",
  });
  const validationLink = `http://localhost:5000/api/Mail/validate/${email}?token=${token}`;

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
    subject: "Welcome!",
    html: `
          <h1>Welcome ${nom} ${prenom}!</h1>
          <p>Veuillez compléter votre candidature. Merci !</p>
          <a href="${validationLink}">Lien de validation</a>
        `,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({ error: "Erreur lors de l'envoi de l'email" });
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send({ msg: "Email sent", validationLink });
    }
  });
};

////////////////////////////////////////////////////////////////////////

const verifierExpirationLien = (req, res) => {
  const email = req.params.email;
  const token = req.query.token;
  console.log(email);
  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      console.log("Token expired or invalid:", err);
      res.status(400).send({ error: "Token expired or invalid" });
    } else {
      res.status(200).send({ msg: "Token is valid" });
      const cand = new Candidat({
        email: email,
        confirmation: true,
      });
      console.log(cand);
      cand
        .save()
        .then(() => {
          res.status(201).json({
            model: cand,
            message: "Candidat ajouté!",
          });
        })
        .catch(() => {});

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
          link: "http://localhost:5000/api/Mail/formulaire/",
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
    }
  });
};

//valider l'email et enregistrer le condidat
const SauvgarderCandidat = (req, res) => {
  const em = req.params.email;
  console.log(em);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_ACCOUNT,
      pass: process.env.PASSWORD_ACCOUNT,
    },
  });

  Candidat.findOneAndUpdate({ email: req.params.email }, req.body, {
    new: false,
  })
    .then((candd) => {
      if (!candd) {
        return res.status(404).json({
          message: "Candidat non trouvé!",
        });
      }

      // Mise à jour réussie du candidat dans la base de données
      var mailOptions = {
        from: "asmabouziri299@gmail.com",
        to: em,
        subject: "OSC Candidature",
        html: "Votre candidature est bien sauvegardée !",
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: error.message });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({ msg: "Email sent" });
        }
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: error.message,
        message: "Données invalides!",
      });
    });
};

module.exports = {
  envoyerMailValidation,
  verifierExpirationLien,
  SauvgarderCandidat,
};
