const multer = require('multer');

// Configurer multer pour gérer le téléchargement de fichiers
const storage = multer.memoryStorage(); // Stocker le fichier en mémoire
const upload = multer({ storage: storage });

// ...


