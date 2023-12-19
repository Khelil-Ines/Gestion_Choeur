const candiats = require("../models/candidat");
// Exemple de liste de candidats 
const candidates = [
  {
    firstName: "John",lastName: "Doe",phone: 123456789,CIN: 987654321,address: "123 Main Street, Cityville",mail: "john.doe@example.com",
    dateOfBirth: new Date("1990-01-15"),status: "Employé",sexe: "Homme",musicalKnowledge: "Intermédiaire",otherActivitie: false,
    Raison: null,Taille: 175,},
  {
    firstName: "Jane",lastName: "Smith",phone: 987654321,CIN: 123456789,address: "456 Oak Avenue, Townsville",mail: "jane.smith@example.com",
    dateOfBirth: new Date("1985-05-20"),status: "Demandeur d'emploi",sexe: "Femme",musicalKnowledge: "Avancé",otherActivitie: true,
    Raison: "Recherche d'opportunités",Taille: 160,
  },
  {
    firstName: "John",lastName: "Doe",phone: 123456789,CIN: 987654321,address: "123 Main Street, Cityville",mail: "john.doe@example.com",
    dateOfBirth: new Date("1990-01-15"),status: "Employé",sexe: "Homme",musicalKnowledge: "Intermédiaire",otherActivitie: false,
    Raison: null,Taille: 175,},
  {
    firstName: "Jane",lastName: "Smith",phone: 987654321,CIN: 123456789,address: "456 Oak Avenue, Townsville",mail: "jane.smith@example.com",
    dateOfBirth: new Date("1985-05-20"),status: "Demandeur d'emploi",sexe: "Femme",musicalKnowledge: "Avancé",otherActivitie: true,
    Raison: "Recherche d'opportunités",Taille: 160,
  },
  {
    firstName: "John",lastName: "Doe",phone: 123456789,CIN: 987654321,address: "123 Main Street, Cityville",mail: "john.doe@example.com",
    dateOfBirth: new Date("1990-01-15"),status: "Employé",sexe: "Homme",musicalKnowledge: "Intermédiaire",otherActivitie: false,
    Raison: null,Taille: 175,},
  {
    firstName: "Jane",lastName: "Smith",phone: 987654321,CIN: 123456789,address: "456 Oak Avenue, Townsville",mail: "jane.smith@example.com",
    dateOfBirth: new Date("1985-05-20"),status: "Demandeur d'emploi",sexe: "Femme",musicalKnowledge: "Avancé",otherActivitie: true,
    Raison: "Recherche d'opportunités",Taille: 160,
  },
];

const ListerCandidats = (req, res) => {
  // Vérification des paramètres de pagination
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;

  if (page < 1 || pageSize < 1) {
    return res
      .status(400)
      .json({
        error:
          "Les paramètres de pagination doivent être des valeurs positives.",
      });
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Vérification du débordement de la liste de candidats
  if (startIndex >= candidates.length) {
    return res
      .status(400)
      .json({ error: "La page demandée est hors de portée." });
  }

  const paginatedCandidates = candidates.slice(startIndex, endIndex);
  // Filtrage par choix arbitraire (nom, prénom, skills, experience)
  const lastNameFilter = req.query.lastName;
  const firstNameFilter = req.query.firstName;
  const musicalKnowledgeFilter = req.query.musicalKnowledge;
  const TailleFilter = req.query.Taille;

  const filteredCandidates = paginatedCandidates.filter((candidate) => {
    return (
      (!firstNameFilter ||candidate.firstName.toLowerCase().includes(firstNameFilter.toLowerCase())) &&
      (!lastNameFilter || candidate.lastName.toLowerCase().includes(lastNameFilter.toLowerCase())) &&
      (!musicalKnowledgeFilter || candidate.musicalKnowledge.toLowerCase().includes(musicalKnowledgeFilter.toLowerCase())) &&
      (!TailleFilter || candidate.Taille.includes(TailleFilter))
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
      totalPages: totalPages,
    },
    filters: {
      firstName: firstNameFilter,
      lastName: lastNameFilter,
      musicalKnowledge: musicalKnowledgeFilter,
      Taille: TailleFilter,
    },
  });
};

module.exports = {
  ListerCandidats: ListerCandidats,
};
