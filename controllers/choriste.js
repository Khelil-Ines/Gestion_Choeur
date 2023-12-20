const User = require("../models/choriste");
const bcrypt = require("bcrypt");
const Repetition = require("../models/repetition");
const jwt = require("jsonwebtoken");
const signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
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
    const token = req.headers.authorization.split(' ')[1];

    try {
      // Récupérez l'ID du choriste depuis le token
      const decodedToken = jwt.verify(token, 'votre_secret_key');
      const choristeId = decodedToken.choristeId;

      // Recherchez la répétition par son ID
      const repetition = await Repetition.findById(idRepetition);

      if (!repetition) {
        return res.status(404).json({ erreur: 'Répétition non trouvée' });
      }

      // Vérification si le lien correspond
      if (repetition.link !== link) {
        return res.status(401).json({ erreur: 'Lien incorrect pour cette répétition' });
      }

      if (repetition.liste_Presents.includes(choristeId)) {
        return res.status(409).json({ erreur: 'Le choriste est déjà présent à cette répétition' });
      }
      

      // Ajout de l'ID du choriste à la liste de présence
      repetition.liste_Presents.push(choristeId);

      // Sauvegarde de la répétition mise à jour
      await repetition.save();

      res.json({ message: 'Présence ajoutée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la vérification du token :', error);

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ erreur: 'Token invalide' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ erreur: 'Token expiré' });
      } else {
        return res.status(500).json({ erreur: 'Erreur interne du serveur' });
      }
    }
  } catch (error) {
    console.error('Erreur lors de la gestion de la présence :', error);
    res.status(500).json({ erreur: 'Erreur interne du serveur' });
  }
};



module.exports = { login, signup , presence };
