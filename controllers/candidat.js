const candiats = require("../models/candidat");
// Exemple de liste de candidats (en pratique, cela pourrait provenir d'une base de données)
const candidates = [
    { id: 1, name: 'John Doe', experience: '3 years', skills: ['JavaScript', 'Node.js'], category: 'Backend' },
    { id: 2, name: 'Jane Smith', experience: '5 years', skills: ['Python', 'React'], category: 'Frontend' },
    { id: 1, name: 'John Doe', experience: '3 years', skills: ['JavaScript', 'Node.js'], category: 'Backend' },
    { id: 2, name: 'Jane Smith', experience: '5 years', skills: ['Python', 'React'], category: 'Frontend' },
    { id: 1, name: 'John Doe', experience: '3 years', skills: ['JavaScript', 'Node.js'], category: 'Backend' },
    { id: 2, name: 'Jane Smith', experience: '5 years', skills: ['Python', 'React'], category: 'Frontend' },
    { id: 1, name: 'John Doe', experience: '3 years', skills: ['JavaScript', 'Node.js'], category: 'Backend' },
    { id: 2, name: 'Jane Smith', experience: '5 years', skills: ['Python', 'React'], category: 'Frontend' },
    { id: 1, name: 'John Doe', experience: '3 years', skills: ['JavaScript', 'Node.js'], category: 'Backend' },
    { id: 2, name: 'Jane Smith', experience: '5 years', skills: ['Python', 'React'], category: 'Frontend' },
    { id: 1, name: 'John Doe', experience: '3 years', skills: ['JavaScript', 'Node.js'], category: 'Backend' },
    { id: 2, name: 'Jane Smith', experience: '5 years', skills: ['Python', 'React'], category: 'Frontend' },
    { id: 1, name: 'John Doe', experience: '3 years', skills: ['JavaScript', 'Node.js'], category: 'Backend' },
    { id: 2, name: 'Jane Smith', experience: '5 years', skills: ['Python', 'React'], category: 'Frontend' },
  ];
  

const ListerCandidats = (req, res) => {
    // Vérification des paramètres de pagination
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  if (page < 1 || pageSize < 1) {
    return res.status(400).json({ error: 'Les paramètres de pagination doivent être des valeurs positives.' });
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Vérification du débordement de la liste de candidats
  if (startIndex >= candidates.length) {
    return res.status(400).json({ error: 'La page demandée est hors de portée.' });
  }

  const paginatedCandidates = candidates.slice(startIndex, endIndex);
  // Filtrage par choix arbitraire (nom, prénom, skills, experience)
  const nameFilter = req.query.name;
  const firstNameFilter = req.query.firstName;
  const skillsFilter = req.query.skills;
  const experienceFilter = req.query.experience;

  const filteredCandidates = paginatedCandidates.filter(candidate => {
    return (
      (!nameFilter || candidate.name.toLowerCase().includes(nameFilter.toLowerCase())) &&
      (!firstNameFilter || candidate.firstName.toLowerCase().includes(firstNameFilter.toLowerCase())) &&
      (!skillsFilter || candidate.skills.includes(skillsFilter)) &&
      (!experienceFilter || candidate.experience.includes(experienceFilter))
    );
  });

  // Informations de pagination
  const totalCandidates = candidates.length;
  const totalPages = Math.ceil(totalCandidates / pageSize);
    // Retourne la liste paginée, les informations de pagination et les filtres
    res.json({
        candidates: filteredCandidates,
        pagination: {
          currentPage: page,
          pageSize: pageSize,
          totalCandidates: totalCandidates,
          totalPages: totalPages
        },
        filters: {
          name: nameFilter,
          firstName: firstNameFilter,
          skills: skillsFilter,
          experience: experienceFilter
        }
      });

  };


  module.exports = {
    ListerCandidats: ListerCandidats
  };