const Choriste = require("../models/choriste");
const Utilisateur = require("../models/utilisateur");
const Absence = require("../models/absence");

exports.declarerAbsence = async (req, res) => {
    
    try {
      // Récupérer le choriste depuis la base de données
      const choriste = await Choriste.findById(req.params.id);
      if (!choriste) {
        return res.status(404).json({ message: "Choriste non trouvé" });
      }
      
      // Incrémenter le compteur d'absences
      choriste.nbr_absences++;
  
      // Créer une nouvelle absence
      const newAbsence = new Absence({
        Type: req.body.Type,
        raison: req.body.raison,
        Date: Date.now(),
      });
  
      // Enregistrer l'absence dans la base de données
      const savedAbsence = await newAbsence.save();
  
      // Ajouter l'absence à la liste des absences du choriste
      choriste.absences.push(savedAbsence._id);
  
  
      // Enregistrer les modifications dans la base de données
      const savedChoriste = await choriste.save();
      Utilisateur.choriste = savedChoriste;
      res.status(201).json({
        message: "Absence créée!",
        choriste: savedChoriste,
      });
  
      console.log(
        `Absence déclarée pour le choriste ${choriste.nom} ${choriste.prénom}. Nouveau statut : ${choriste.statut}`
      );
    } catch (error) {
      console.error("Erreur lors de la déclaration de l'absence :", error);
      res.status(500).json({ error: "Erreur lors de la déclaration de l'absence" });
    }
  };