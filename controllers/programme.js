const Programme = require("../models/programme.js");

const addProgramme = (req, res) => {
  Programme.create(req.body)
   .then((programme) => {
      res.status(201).json({
        model: programme,
        message: "Programme crée!",
      });
    })
   .catch((error) => res.status(400).json({ error }));
};

const addProgrammewithFile = (req, res) => {

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }
  
    // Convertir le fichier Excel en JSON
    const excelData = excelToJson({
      sourceFile: Buffer.from(req.file.buffer).toString('utf8')
    });
  
    // En supposant que votre fichier Excel a une structure spécifique, ajustez le code en conséquence
    const programmeData = excelData.sheet1; // Ajustez le nom de la feuille si nécessaire
  
    Programme.create(programmeData)
      .then((programme) => {
        res.status(201).json({
          model: programme,
          message: 'Programme créé!',
        });
      })
      .catch((error) => res.status(400).json({ error }));
  };

const getProgrammes = (req, res) => {
    Programme.find().populate("oeuvre")
     .then((programmes) => {
        res.status(200).json(programmes);
      })
     .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  }

  module.exports = {
    addProgramme,
    getProgrammes,
    addProgrammewithFile
  };