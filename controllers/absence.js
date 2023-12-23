const Choriste = require("../models/choriste");
const Utilisateur = require("../models/utilisateur");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const choriste = require("../models/choriste");
const Absence = require("../models/absence");
const Repetition = require("../models/repetition");
const Concert = require("../models/concert");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayaghattas606@gmail.com",
    pass: "peew vcuf wmhd yvcf",
  },
});

exports.envoyerEmailElimination = async (req, res) => {
  try {
    // Récupérez tous les choristes ayant le statut "éliminé"
    const choristesElimines = await Choriste.find({ statut: "Eliminé" });

    // Vérifiez s'il y a des choristes éliminés
    if (choristesElimines.length === 0) {
      return res.status(404).json({ message: "Aucun choriste éliminé trouvé" });
    } else {
      for (const choristeElimine of choristesElimines) {
        const sujet = "Elimination ! ";
        const file = path.join(__dirname, "../views/eliminationmail.ejs");

        const renderedContent = ejs.renderFile(file, async (err, data) => {
          if (err) {
            console.error(err);
            return res
              .status(500)
              .json({ error: "Erreur lors du rendu du fichier EJS." });
          }
        });
        const mailOptions = {
          from: transporter.user,
          to: choristeElimine.mail,
          subject: sujet,
          html: "<p> Vous avez dépassé le seuil d'absence ! Vous avez été éliminé du choral. </p>",
        };

        await transporter.sendMail(mailOptions);

        res
          .status(200)
          .json({ message: "E-mail d'élimination envoyé avec succès." });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
  }
};

exports.envoyerEmailNomination = async (req, res) => {
  try {
    // Récupérez tous les choristes ayant le statut "Nominé"
    const choristesNomines = await Choriste.find({ statut: "Nominé" });

    // Vérifiez s'il y a des choristes nominés
    if (choristesElimines.length === 0) {
      return res.status(404).json({ message: "Aucun choriste nominé trouvé" });
    } else {
      for (const choristeNomine of choristesNomines) {
        const sujet = "Nomination ! ";

        const mailOptions = {
          from: transporter.user,
          to: choristeNomine.mail,
          subject: sujet,
          html: "<p> Vous allez bientôt dépasser le seuil d'absence ! Vous risquez l'élimination. </p>",
        };

        await transporter.sendMail(mailOptions);

        res
          .status(200)
          .json({ message: "E-mail de nomination envoyé avec succès." });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
  }
};



 seuilNomination = 3;
exports.updateSeuilElimination = (req, res) => {
    seuilNomination = req.body.nouveauSeuil; 
  
    res.status(200).json({ message: 'Seuil mis à jour avec succès' });
  };
exports.declarerAbsenceRepetition = async (req, res) => {
  try {
    // Find the latest repetition
    const latestRepetition = await Repetition.findOne().sort({ date: -1 });

    if (!latestRepetition) {
      console.error('No repetition found.');
      return;
    }
    
    for (const choristeId of latestRepetition.liste_Abs) {
      const choriste = await Choriste.findById(choristeId);

      if (!choriste) {
        console.error(`Choriste with ID ${choristeId} not found.`);
        continue; // Move to the next iteration if choriste not found
      }
      // Incrémenter le compteur d'absences
      choriste.nbr_absences++;
  
      // Créer une nouvelle absence
      const newAbsence = new Absence({
        Type: "Repetition",
        raison: raison,
        Date: latestRepetition.date,
      });
  
      // Enregistrer l'absence dans la base de données
      const savedAbsence = await newAbsence.save();
  
      // Ajouter l'absence à la liste des absences du choriste
      choriste.absences.push(savedAbsence._id);
  
      // Mettre à jour le statut en fonction des nouvelles règles
      if (choriste.nbr_absences > seuilNomination) {
        choriste.statut = "Eliminé";
        choriste.historiqueStatut.push({
          statut: choriste.statut,
          date: new Date(),
        });
      } else if (choriste.nbr_absences == seuilNomination) {
        choriste.statut = "Nominé";
        choriste.historiqueStatut.push({
          statut: choriste.statut,
          date: new Date(),
        });
      }
  
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
    }} catch (error) {
      console.error("Erreur lors de la déclaration de l'absence :", error);
      res.status(500).json({ error: "Erreur lors de la déclaration de l'absence" });
    }
  }

  exports.declarerAbsenceConcert = async (req, res) => {
    try {
      // Find the latest repetition
      const latestConcert = await Concert.findOne().sort({ date: -1 });
  
      if (!latestConcert) {
        console.error('No concert found.');
        return;
      }
      
      for (const choristeId of latestConcert.liste_Abs) {
        const choriste = await Choriste.findById(choristeId);
  
        if (!choriste) {
          console.error(`Choriste with ID ${choristeId} not found.`);
          continue; // Move to the next iteration if choriste not found
        }
        // Incrémenter le compteur d'absences
        choriste.nbr_absences++;
    
        // Créer une nouvelle absence
        const newAbsence = new Absence({
          Type: "Concert",
          raison: raison,
          Date: latestConcert.date,
        });
    
        // Enregistrer l'absence dans la base de données
        const savedAbsence = await newAbsence.save();
    
        // Ajouter l'absence à la liste des absences du choriste
        choriste.absences.push(savedAbsence._id);
    
        // Mettre à jour le statut en fonction des nouvelles règles
        if (choriste.nbr_absences > seuilNomination) {
          choriste.statut = "Eliminé";
          choriste.historiqueStatut.push({
            statut: choriste.statut,
            date: new Date(),
          });
        } else if (choriste.nbr_absences == seuilNomination) {
          choriste.statut = "Nominé";
          choriste.historiqueStatut.push({
            statut: choriste.statut,
            date: new Date(),
          });
        }
    
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
      }} catch (error) {
        console.error("Erreur lors de la déclaration de l'absence :", error);
        res.status(500).json({ error: "Erreur lors de la déclaration de l'absence" });
      }
    }

  exports.getAbsencesChoriste = async (req, res) => {
    try {
      const choriste = await Choriste.findById(req.params.id).populate('absences');
      if (!choriste) {
        return res.status(404).json({ message: "Choriste non trouvé" });
      }
      const absences = choriste.absences;
      return res.status(200).json({ absences });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des absences." });
    }
  };
exports.getElimines = async (req, res) => {
    try{

        const ChoristesEliminees = await Choriste.find({ statut: 'Eliminé' });

        return res.status(200).json({ ChoristesEliminees });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des éliminés." });
    }
    };

    exports.getNomines = async (req, res) => {
        try{
    
            const ChoristesNominees = await Choriste.find({ statut: 'Nominé' });
    
            return res.status(200).json({ ChoristesNominees });
        } catch (error) {
          console.error(error);
          res
            .status(500)
            .json({ error: "Erreur lors de la récupération des Nominés." });
        }
        };
