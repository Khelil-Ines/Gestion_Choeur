
const Compte = require('../models/compte');
const Choriste = require('../models/choriste');
const Utilisateur = require('../models/utilisateur');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cron = require("node-cron");


const addCompte = async (req, res) => {
  try {
    const idUtilisateur = req.params.id;

    // Vérifiez si l'utilisateur existe
    const utilisateur = await Utilisateur.findById(idUtilisateur);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    // Récupérez le mot de passe du corps de la requête
    const { motDePasse } = req.body;

    // Vérifiez si le mot de passe est fourni
    if (!motDePasse) {
      return res.status(400).json({ message: 'Le mot de passe est obligatoire.' });
    }

    // Utilisez l'email de l'utilisateur comme login
    const login = utilisateur.email;

    // Hash du mot de passe
    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    // Créez un nouveau compte
    const nouveauCompte = new Compte({
      login: login,
      motDePasse: motDePasseHash,
    });

    // Enregistrez le compte dans la base de données
    const compteEnregistre = await nouveauCompte.save();

    // Associez le compte à l'utilisateur
    utilisateur.compte = compteEnregistre._id;

    // Enregistrez la mise à jour de l'utilisateur dans la base de données
    await utilisateur.save();

    res.status(201).json({ utilisateur, compte: compteEnregistre });
  } catch (error) {
    console.error('Erreur lors de la création du compte :', error);
    res.status(500).json({ error: 'Échec de la création du compte.' });
  }
};

const fetchCompte = (req, res) => {
  Compte.findOne({ _id: req.params.id })
    .then((compte) => {
      if (!compte) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
          model: compte,
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
};

const getCompte = (req, res) => {
  Compte.find()
    .then((comptes) => {
      res.status(200).json({
        model: comptes,
        message: "success",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
        message: "problème d'extraction",
      });
    });
};

const deleteCompte = (req, res) => {
  Compte.deleteOne({ _id: req.params.id })
    .then((compte) =>
      res.status(200).json({
        message: "success!",
      })
    )

    .catch(() => {
      res.status(400).json({
        error: Error.message,
        message: "probleme d'extraction ",
      });
    });

};


const EliminerChoriste = async (req, res) => {
  try {
    // Find the choriste
    const choriste = await Choriste.findById(req.params.id);
    console.log(choriste._id);
    if (!choriste) {
      res.status(404).json({
        message: "Choriste non trouvé!",
      });
    } else {
      // Get the compte ID associated with the choriste
      const c = choriste.compte;
      console.log(choriste.compte);
      // Delete the compte
      const deletedCompteResult = await Compte.deleteOne({ _id: c });
      if (deletedCompteResult.deletedCount === 0) {
        res.status(404).json({
          message: "Compte non trouvé!",
        });
      }
      // Update choriste status and historiqueStatut
      choriste.statut = "Eliminé_D";
      choriste.Compte = null;
      choriste.historiqueStatut.push({
        statut: choriste.statut,
        date: new Date(),
      });
      // Enregistrer les modifications dans la base de données
      const savedChoriste = await choriste.save();
      Utilisateur.choriste = savedChoriste;
      return res.status(201).json({
        message: "Choriste éliminé pour une raison disciplinaire!",
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'élimination du choriste :", error);
    res.status(500).json({
      error: "Erreur!!",
    });
  }
};

const login = (req, res, next) => {
  Compte.findOne({ login: req.body.login })
    .then((compte) => {
      if (!compte) {
        return res
          .status(401)
          .json({ message: "Login ou mot passe incorrecte" });
      }
      bcrypt
        .compare(req.body.motDePasse, compte.motDePasse)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Login ou mot passe incorrecte" });
          }
          res.status(200).json({
            token: jwt.sign({ compteId: compte._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};


// SupprimerCompteEliminéAuto = cron.schedule("30 23 * * *", async () => {
//   try {
//     const choristesElimines = await Choriste.find({
//       $or: [{ statut: "Eliminé" }, { statut: "Eliminé_Discipline" }],
//     });

//     // Parcourir les choristes et supprimer leur compte
//     for (const choriste of choristesElimines) {
//       const c = choriste.compte;
//       console.log(choriste.compte);
//       // Delete the compte
//       const deletedCompteResult = await Compte.deleteOne({ _id: c });
//       if (deletedCompteResult.deletedCount === 0) {
//         console.log( "Compte non trouvé!")
//       }
//     }
//      console.log("Comptes choristes éliminés supprimés!")
//   } catch (error) {
//     console.error("Erreur lors de l'élimination du choriste :", error);
//   }
// });

// SupprimerCompteEliminéAuto.start();

module.exports = {
  addCompte,
  fetchCompte,
  getCompte,
  deleteCompte,
  EliminerChoriste,
  login
};
