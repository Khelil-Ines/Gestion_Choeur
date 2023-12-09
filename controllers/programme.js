const Programme = require("../models/programme.js");
const Oeuvre = require("../models/oeuvre.js");
const excelToJson = require("convert-excel-to-json");
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

// const addProgrammewithFile = (req, res) => {

//     if (!req.file) {
//       return res.status(400).json({ message: 'Aucun fichier téléchargé' });
//     }

//     // Convertir le fichier Excel en JSON
//     const excelData = excelToJson({
//       sourceFile: Buffer.from(req.file.buffer).toString('utf8')
//     });

//     // En supposant que votre fichier Excel a une structure spécifique, ajustez le code en conséquence
//     const programmeData = excelData.sheet1; // Ajustez le nom de la feuille si nécessaire

//     Programme.create(programmeData)
//       .then((programme) => {
//         res.status(201).json({
//           model: programme,
//           message: 'Programme créé!',
//         });
//       })
//       .catch((error) => res.status(400).json({ error }));
//   };

// const addProgrammewithFile = (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "Aucun fichier téléchargé" });
//   }

//   // Convertir le fichier Excel en JSON
//   const excelData = excelToJson({
//     sourceFile: Buffer.from(req.file.buffer).toString("utf8"),
//   });

//   // Parcourir les données Excel et créer un document Programme pour chaque ligne
//   excelData.sheet1.forEach((row) => {
//     const programme = new Programme({
//       theme: row.theme,
//       oeuvre: row.oeuvre, // référence à l'ID de l'oeuvre
//     });

//     programme
//       .save()
//       .then((programme) => {
//         console.log("Programme créé :", programme);
//       })
//       .catch((err) => {
//         console.error("Erreur lors de la création du programme :", err);
//       });
//   });

//   res.status(201).json({
//     message: "Programmes créés à partir du fichier Excel",
//   });
// };

// const addProgrammewithFile = async (req, res) => {
//   try {
//     console.log("req.file", req.file);
//     console.log("req.body",req.body)
//     if (!req.file) {
//       return res.status(400).json({ message: 'Aucun fichier téléchargé' });
//     }

//     // Convertir le fichier Excel en JSON
//     const excelData = excelToJson({
//       sourceFile: Buffer.from(req.file.buffer),
//       header: {
//         rows: 1 // Nombre de lignes à utiliser comme en-tête (si vos en-têtes sont à la première ligne)
//       },
//       sheets: ['Sheet1'], // Liste des noms des feuilles à traiter
//       columnToKey: { // Associe les noms de colonnes à des clés spécifiques dans l'objet JSON résultant
//         A: 'theme',
//         B: 'oeuvre',
//       }
//     });

//     if (!excelData || !excelData.sheet1) {
//       return res.status(400).json({ message: 'Le fichier Excel ne contient pas de données valides' });
//     }

//     // Parcourir les données Excel et créer un document Programme pour chaque ligne
//     const programmes = excelData.sheet1.map((row) => {
//       return new Programme({
//         theme: row.theme,
//         oeuvre: row.oeuvre, // Référence à l'ID de l'oeuvre
//       });
//     });

//     if (programmes.length === 0) {
//       return res.status(400).json({ message: 'Aucun programme trouvé dans le fichier Excel' });
//     }

//     // Sauvegarder tous les programmes en une seule fois
//     const savedProgrammes = await Programme.insertMany(programmes);

//     res.status(201).json({
//       message: 'Programmes créés à partir du fichier Excel',
//       programmes: savedProgrammes,
//     });
//   } catch (error) {
//     console.error('Erreur lors de la création des programmes :', error);
//     res.status(500).json({ error: 'Erreur lors de la création des programmes' });
//   }
// };
const xlsx = require("xlsx");
const addProgrammewithFile = async (req, res) => {
  try {
    console.log("req.file", req.file);
    console.log("req.body", req.body);
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier téléchargé" });
    }

    // Convertir le buffer du fichier Excel en un objet JSON
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
      // Check if a Programme with the same theme already exists
      const existingProgramme = await Programme.findOne({ theme: row.theme });

      if (existingProgramme) {
        // If it exists, update or add the Oeuvre
        const savedOeuvre = await Oeuvre.findOneAndUpdate(
          { titre: row.oeuvre },
          { $addToSet: { choral: row.choriste } },
          { upsert: true, new: true }
        );

        // Update the Programme to include the Oeuvre if it's not already included
        if (!existingProgramme.oeuvre.includes(savedOeuvre._id)) {
          existingProgramme.oeuvre.push(savedOeuvre._id);
          await existingProgramme.save();
        }

        savedProgrammes.push(existingProgramme);
        savedOeuvres.push(savedOeuvre);
      } else {
        // If the Programme doesn't exist, create both Programme and Oeuvre
        const newOeuvre = new Oeuvre({
          titre: row.oeuvre,
          choral: row.choriste,
        });

        const savedOeuvre = await newOeuvre.save();

        const newProgramme = new Programme({
          theme: row.theme,
          oeuvre: [savedOeuvre._id], // Store Oeuvre IDs as an array
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

const getProgrammes = (req, res) => {
  Programme.find()
    .populate("oeuvre")
    .then((programmes) => {
      res.status(200).json(programmes);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

module.exports = {
  addProgramme,
  getProgrammes,
  addProgrammewithFile,
};
