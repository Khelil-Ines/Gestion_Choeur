const Candidat = require("../models/candidat");

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
};

module.exports = {
  ListerCandidats: ListerCandidats,
};