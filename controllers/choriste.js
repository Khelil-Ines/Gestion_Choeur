const User = require("../models/choriste");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Repetition = require("../models/repetition");
const Concert = require("../models/concert");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        pupitre: req.body.pupitre,
        password: hash,
      });
      user
        .save()
        .then((response) => {
          const newUser = response.toPublic();
          res.status(201).json({
            user: newUser,
            message: "utilisateur crée",
          });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};

const login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Login ou mot passe incorrecte" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Login ou mot passe incorrecte" });
          }
          res.status(200).json({
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

const presence = async (req, res) => {
  try {
    const { idRepetition, link } = req.params;

    // Vérifiez le token dans le header de la requête
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
      const userId = decodedToken.userId;

      // Recherchez la répétition par son ID
      const repetition = await Repetition.findById(idRepetition);

      if (!repetition) {
        return res.status(404).json({ erreur: "Répétition non trouvée" });
      }

      // Vérification si le lien correspond
      if (repetition.link !== link) {
        return res
          .status(401)
          .json({ erreur: "Lien incorrect pour cette répétition" });
      }

      if (repetition.liste_Presents.includes(userId)) {
        return res
          .status(409)
          .json({ erreur: "Le choriste est déjà présent à cette répétition" });
      }

      // Supprimer l'ID du choriste de la liste d'absence s'il est présent
      repetition.liste_Abs = repetition.liste_Abs.filter(
        (absentId) => absentId.toString() !== userId.toString()
      );

      // Ajout de l'ID du choriste à la liste de présence
      repetition.liste_Presents.push(userId);

      // Sauvegarde de la répétition mise à jour
      await repetition.save();

      res.json({ message: "Présence ajoutée avec succès" });
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ erreur: "Token invalide" });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).json({ erreur: "Token expiré" });
      } else {
        return res.status(500).json({ erreur: "Erreur interne du serveur" });
      }
    }
  } catch (error) {
    console.error("Erreur lors de la gestion de la présence :", error);
    res.status(500).json({ erreur: "Erreur interne du serveur" });
  }
};

//presence_concert
const presenceConcert = async (req, res) => {
  try {
    const { idConcert, link } = req.params;

    // Vérifiez le token dans le header de la requête
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
      const userId = decodedToken.userId;

      // Recherchez la répétition par son ID
      const concert = await Concert.findById(idConcert);

      if (!concert) {
        return res.status(404).json({ erreur: "concert non trouvée" });
      }

      // Vérification si le lien correspond
      if (concert.link !== link) {
        return res
          .status(401)
          .json({ erreur: "Lien incorrect pour cet concert" });
      }

      if (
        !concert.liste_Abs.includes(userId) &&
        !concert.liste_Presents.includes(userId)
      ) {
        return res
          .status(409)
          .json({ erreur: "Le choriste n'est pas disponible pour ce concert" });
      }

      if (concert.liste_Presents.includes(userId)) {
        return res
          .status(409)
          .json({ erreur: "Le choriste est déja présent pour ce concert" });
      }

      // Supprimer l'ID du choriste de la liste d'absence s'il est présent
      concert.liste_Abs = concert.liste_Abs.filter(
        (absentId) => absentId.toString() !== userId.toString()
      );

      // Ajout de l'ID du choriste à la liste de présence
      concert.liste_Presents.push(userId);

      // Sauvegarde de la répétition mise à jour
      await concert.save();

      res.json({ message: "Présence ajoutée avec succès" });
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ erreur: "Token invalide" });
      } else if (error.name === "TokenExpiredError") {
        return res.status(401).json({ erreur: "Token expiré" });
      } else {
        return res.status(500).json({ erreur: "Erreur interne du serveur" });
      }
    }
  } catch (error) {
    console.error("Erreur lors de la gestion de la présence :", error);
    res.status(500).json({ erreur: "Erreur interne du serveur" });
  }
};

//consulter  la liste des choristes pour tout le chœur pour un concert spécifique

const Lister_choriste_toutchoeur = async (req, res) => {
  try {
    const { idConcert } = req.params;

    // Recherchez le concert par son ID
    const concert = await Concert.findById(idConcert);

    if (!concert) {
      return res.status(404).json({ erreur: "Concert non trouvé" });
    }

    // Vérifiez si la liste d'absence est vide
    if (concert.liste_Abs.length === 0) {
      return res.json({ message: "Aucun choriste n'a déclaré sa disponibilité pour ce concert" });
    }

    // Filtrer les choristes par confirmationStatus
    // Filtrer les choristes par confirmationStatus
    const choristesToutChoeur = await User.find(
      {
        confirmationStatus: "Confirmé",
        _id: { $in: concert.liste_Abs },
      },
      // excluez le champ "motDePasse"
      { password: 0 ,
        confirmationStatus : 0 ,
        oneTimeToken:0},);

    res.json({ choristesToutChoeur });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des choristes pour tout le chœur :",
      error
    );
    res.status(500).json({ erreur: "Erreur interne du serveur" });
  }
};


//consulter  la liste des choristes pour tout le chœur pour un concert spécifique

const Lister_choriste_pupitre = async (req, res) => {
  try {
    const { idConcert, pupitre } = req.params;

    // Recherchez le concert par son ID
    const concert = await Concert.findById(idConcert);

    if (!concert) {
      return res.status(404).json({ erreur: 'Concert non trouvé' });
    }

    // Vérifiez si le pupitre spécifié existe
    const pupitresExistants = ['Soprano','Alto','Basse','Tenor']; // Ajoutez les pupitres existants
    if (!pupitresExistants.includes(pupitre)) {
      return res.status(400).json({ erreur: `Le pupitre ${pupitre} n'existe pas` });
    }

    // Vérifiez si la liste d'absence est vide
    if (concert.liste_Abs.length === 0) {
      return res.json({ message: "Aucun choriste n'a déclaré sa disponibilité pour ce concert" });
    }

    // Filtrer les choristes par pupitre et confirmationStatus
    const choristesParPupitre = await User.find({
      pupitre: pupitre,
      confirmationStatus: 'Confirmé',
      _id: { $in: concert.liste_Abs },
    },
    // excluez le champ "motDePasse"
    { password: 0 ,
      confirmationStatus : 0 ,
      oneTimeToken:0 , 
      pupitre:0},
    
    );

    // Vérifiez si la liste des choristes par pupitre est vide
    if (choristesParPupitre.length === 0) {
      return res.json({ message: `Aucun choriste du pupitre ${pupitre} n'a déclaré sa disponibilité pour ce concert` });
    }

    res.json({ choristesParPupitre });
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des choristes par pupitre :', error);
    res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
};



const setDispo = async (req, res) => {
  const { idConcert } = req.params;

  // Vérifiez le token dans le header de la requête
  const token = req.headers.authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;

    // Recherchez le concert par son ID
    const concert = await Concert.findById(idConcert);

    if (!concert) {
      return res.status(404).json({ erreur: "Concert non trouvé" });
    }
    // Générer un jeton unique
    const oneTimeToken = crypto.randomBytes(20).toString("hex");
    // Mettez à jour le statut de confirmation pour le choriste
    const choriste = await User.findById(userId);
    // Mettez à jour le choriste avec le jeton
    if (!choriste) {
      return res.status(404).json({ erreur: "Choriste non trouvé" });
    }
    choriste.oneTimeToken = oneTimeToken;
    await choriste.save();

    if (concert.liste_Abs.includes(userId)) {
      return res
        .status(409)
        .json({ erreur: "Le choriste est déjà disponible à ce concert" });
    }

    // Envoi d'un e-mail au choriste pour confirmer sa disponibilité
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ghofranemn22@gmail.com",
        pass: "hgfr npar pidn zvje",
      },
    });

    const mailOptions = {
      from: "ghofranemn22@gmail.com",
      to: choriste.email,
      subject: "Confirmation de disponibilité",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de disponibilité</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #007BFF;
    }

    p {
      margin-bottom: 20px;
    }

    button {
      background-color: #007BFF;
      color: #fff;
      padding: 10px 20px;
      font-size: 16px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      text-decoration: none;
    }

    button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Confirmation de disponibilité</h1>
    <p>Merci de confirmer votre disponibilité en cliquant sur le bouton ci-dessous :</p>
    <form method="get" action="http://127.0.0.1:3000/choriste/confirm-dispo/${userId}/${idConcert}/${oneTimeToken}">
      <button type="submit">Confirmer la disponibilité</button>
    </form>
    <p>Si le bouton ne fonctionne pas, vous pouvez également copier et coller le lien suivant dans votre navigateur :</p>
    <p><a href="http://127.0.0.1:3000/choriste/confirm-dispo/${userId}/${idConcert}/${oneTimeToken}">http://127.0.0.1:3000/choriste/confirm-dispo/${userId}/${idConcert}/${oneTimeToken}</a></p>
  </div>
</body>
</html>`,
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
        return res.status(500).json({ erreur: "Erreur interne du serveur" });
      }

      console.log("E-mail envoyé :", info.response);

      res.json({
        message:
          "E-mail de confirmation envoyé. Veuillez confirmer votre disponibilité.",
      });
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ erreur: "Token invalide" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ erreur: "Token expiré" });
    } else {
      return res.status(500).json({ erreur: "Erreur interne du serveur" });
    }
  }
};

const confirmDispo = async (req, res) => {
  const { userId, idConcert, uniqueToken } = req.params;

  try {
    const choriste = await User.findById(userId);
    const concert = await Concert.findById(idConcert);

    if (!choriste) {
      return res.status(404).json({ erreur: "Choriste non trouvé" });
    }

    // Vérifiez si le token reçu correspond au token associé au choriste
    if (choriste.oneTimeToken !== uniqueToken) {
      return res.status(401).json({ erreur: "Token de confirmation invalide" });
    }

    choriste.confirmationStatus = "Confirmé";
    choriste.oneTimeToken = null; // Effacez le token après confirmation
    await choriste.save();

    // Ajoutez le choriste à la liste d'absence uniquement après confirmation
    if (
      choriste.confirmationStatus === "Confirmé" &&
      !concert.liste_Abs.includes(userId)
    ) {
      concert.liste_Abs.push(userId);
      await concert.save();
    }

    res.json({
      message:
        "Confirmation réussie. Le choriste a été ajouté à la liste d'absence.",
    });
  } catch (error) {
    console.error("Erreur lors de la confirmation de disponibilité :", error);
    res.status(500).json({ erreur: "Erreur interne du serveur" });
  }
};

module.exports = {
  login,
  signup,
  presence,
  presenceConcert,
  Lister_choriste_toutchoeur,
  setDispo,
  confirmDispo,
  Lister_choriste_pupitre,
};
