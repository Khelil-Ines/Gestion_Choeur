const Programme = require("../models/programme.js");
const Oeuvre = require("../models/oeuvre.js");
const excelToJson = require("convert-excel-to-json");


const addProgramme = async (req, res) => {
  try {
    const existingProgramme = await Programme.findOne({ theme: req.body.theme });

    if (existingProgramme) {
      return res.status(400).json({
        message: "Le thème est déjà enregistré pour un programme existant.",
      });
    }
    
    
    const oeuvreIds = req.body.oeuvre;
    const invalidOeuvreIds = [];
    
    // Check if all provided oeuvre IDs exist in the "oeuvre" model
    for (const oeuvreId of oeuvreIds) {
      const oeuvre = await Oeuvre.findById(oeuvreId);
    
      if (!oeuvre) {
        invalidOeuvreIds.push(oeuvreId);
      }
    }
    
    if (invalidOeuvreIds.length > 0) {
      return res.status(400).json({
        message: "Certains ID d'oeuvre fournis ne sont pas valides.",
        invalidOeuvreIds,
      });
    }
    
    
    const newProgramme = await Programme.create(req.body);

    res.status(201).json({
      model: newProgramme,
      message: "Programme créé avec succès!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "Une erreur s'est produite lors de la création du programme.",
    });
  }
};

const xlsx = require("xlsx");
const addProgrammewithFile = async (req, res) => {
  try {
    console.log("req.file", req.file);
    console.log("req.body", req.body);
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier téléchargé" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return res
        .status(400)
        .json({
          message: "Le fichier Excel ne contient pas de feuille valide",
        });
    }

    const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!excelData || excelData.length === 0) {
      return res
        .status(400)
        .json({
          message: "Le fichier Excel ne contient pas de données valides",
        });
    }

    const savedProgrammes = [];
    const savedOeuvres = [];

    for (const row of excelData) {
      const existingProgramme = await Programme.findOne({ theme: row.theme });

      if (existingProgramme) {
        const savedOeuvre = await Oeuvre.findOneAndUpdate(
          { titre: row.oeuvre },
          { $addToSet: { choral: row.choriste } },
          { upsert: true, new: true }
        );

        if (!existingProgramme.oeuvre.includes(savedOeuvre._id)) {
          existingProgramme.oeuvre.push(savedOeuvre._id);
          await existingProgramme.save();
        }

        savedProgrammes.push(existingProgramme);
        savedOeuvres.push(savedOeuvre);
      } else {
        const newOeuvre = new Oeuvre({
          titre: row.oeuvre,
          choral: row.choriste,
        });

        const savedOeuvre = await newOeuvre.save();

        const newProgramme = new Programme({
          theme: row.theme,
          oeuvre: [savedOeuvre._id], 
        });

        const savedProgramme = await newProgramme.save();

        savedProgrammes.push(savedProgramme);
        savedOeuvres.push(savedOeuvre);
      }
    }

    res.status(201).json({
      message: "Programmes et Oeuvres créés à partir du fichier Excel",
      programmes: savedProgrammes,
      oeuvres: savedOeuvres,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la création des programmes et oeuvres :",
      error
    );
    res
      .status(500)
      .json({ error: "Programmes et Oeuvres déja existants !" });
  }
};

const getProgrammes = async (req, res) => {
  try {
    const programmes = await Programme.find().populate('oeuvre');
    res.status(200).json({ model: programmes, message: "success" });
  } catch (error) {
    res.status(500).json({ error: error.message, message: "problème d'extraction" });
  }
};


module.exports = {
  addProgramme,
  getProgrammes,
  addProgrammewithFile,
};
