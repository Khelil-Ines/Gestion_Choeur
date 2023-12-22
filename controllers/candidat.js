const Candidat = require("../models/candidat");
const moment = require('moment-timezone');


const ListerCandidats = async (req, res) => {
  try {
    // Vérification des paramètres de pagination
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

   if (page < 1 || pageSize < 1) {
      return res.status(400).json({
        error: "Les paramètres de pagination doivent être des valeurs positives.",
      });
    }

    // Utilisation de Mongoose pour paginer les candidats
    const startIndex = (page - 1) * pageSize;

    const candidates = await Candidat.find()
      .skip(startIndex)
      .limit(pageSize);
     
    // Récupération du nombre total de candidats pour la pagination
    const totalCandidates = await Candidat.countDocuments();
    const totalPages = Math.ceil(totalCandidates / pageSize);

    // Filtrage par choix arbitraire (nom, prénom, skills, experience)
    const lastNameFilter = req.query.nom;
    const firstNameFilter = req.query.prénom;

    console.log(firstNameFilter)


    const filteredCandidates = candidates.filter((candidate) => {
      return (
        (!firstNameFilter || candidate.prénom.toLowerCase().includes(firstNameFilter.toLowerCase())) ||
        (!lastNameFilter || candidate.nom.toLowerCase().includes(lastNameFilter.toLowerCase()))
        
      )
    });
    console.log(filteredCandidates)
    // Retourne la liste paginée, les informations de pagination et les filtres
    res.json({
      candidates: filteredCandidates,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalCandidates: totalCandidates,
        totalPages: totalPages,
      },
      filters: {
        firstName: firstNameFilter,
        lastName: lastNameFilter,

      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des candidats." });
  }

}



const fetchCandidat = (req, res) => {
    Candidat.findOne({ _id: req.params.id })
    .then((candidat) => {
      if (!candidat) {
        res.status(404).json({
          message: "objet non trouvé!",
        });
      } else {
        res.status(200).json({
          model: candidat,
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



  const getCandidat = (req, res) => {
    Candidat.find().then((candidats) => {
      res.status(200).json({
        model: candidats,
        message: "success"
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
        message: "problème d'extraction"
      });
    });
  };

  const updateCandidat = (req, res) => {
    Candidat.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }).then(
        (candidat) => {
          if (!candidat) {
            res.status(404).json({
              message: "objet non trouvé!",
            });
          } else {
            res.status(200).json({
              model: candidat,
              message: "objet modifié!",
            });
          }
        }
      )
}

const getCandidatsByPupitre = (req, res) => {
  const pupitreNom = req.body.pupitreNom;

  Candidat.find({ pupitre: pupitreNom })
    .then((candidats) => {
      res.status(200).json({
        model: candidats,
        message: "Liste des candidats par pupitre récupérée avec succès!",
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error.message,
        message: "Problème d'extraction des candidats par pupitre",
      });
    });
};



const addCandidat = (req, res) => {
  try {
    // Récupérer les données du candidat depuis le corps de la requête
    const candidatData = req.body;

    // Ajouter la date de création avec le fuseau horaire "Europe/Paris"
    candidatData.createdAt = moment().tz('Europe/Paris').toDate();

    // Créer une nouvelle instance de Candidat
    const newCandidat = new Candidat(candidatData);

    // Enregistrer le candidat dans la base de données
    newCandidat.save()
      .then(candidat => {
        res.json(candidat);
      })
      .catch(err => {
        console.error('Erreur lors de la création du candidat :', err);
        res.status(400).json({ erreur: 'Échec de la création du candidat', message: err.message });
      });
  } catch (error) {
    console.error('Erreur lors de la création du candidat :', error);
    res.status(500).json({ erreur: 'Erreur lors de la création du candidat', message: error.message });
  }
};


module.exports = {
  addCandidat,
  getCandidat,
  fetchCandidat,
  updateCandidat,
  getCandidatsByPupitre,
  ListerCandidats,
  }
