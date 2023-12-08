const Choriste = require("../models/choriste");
const cron = require('node-cron');

const saisonCourante = new Date().getFullYear(); 


// Fonction pour mettre à jour le statut d'un choriste en fonction des règles spécifiées
const mettreAJourStatutSelonRegles = (choriste) => {

    // Vérifier s'il y a des entrées dans l'historique du statut
    if (choriste.historiqueStatut.length > 0) {
        const dernierStatut = choriste.historiqueStatut[choriste.historiqueStatut.length - 1].statut;

        // Si le dernier statut est "Sénior", le choriste reste "Sénior" jusqu'à nouvel ordre
        if (dernierStatut === "Sénior") {
            return "Sénior";
        }
    }

    if (choriste.date_adhesion.getFullYear() === saisonCourante) {
        return "Junior";
    } else if ( choriste.date_adhesion.getFullYear() === saisonCourante - 1) {
        return "Choriste";
    } else if (((choriste.date_adhesion.getFullYear() - saisonCourante) >= 3  ) && choriste.nbr_repetitions >= 5 && choriste.nbr_concerts >= 5) {
        return "Sénior";
    } else if (choriste.date_adhesion && (choriste.date_adhesion.getFullYear() === 2018 || choriste.date_adhesion.getFullYear() === 2019)) {
        return "Vétéran"; 
    }else {
        return "Choriste"; 
    }
};


// Tâche planifiée pour déclencher la mise à jour du statut au début de chaque saison,programmée pour s'exécuter à minuit le 1er octobre de chaque année
const tacheMiseAJourStatut = cron.schedule('0 0 1 10 *', async () => {
    try {

        // Récupérer tous les choristes à partir de la base de données (vous pouvez personnaliser cela en fonction de vos besoins)
        const choristes = await Choriste.find();

        // Mettez à jour le statut pour chaque choriste
        for (const choriste of choristes) {
            const nouveauStatut = mettreAJourStatutSelonRegles(choriste);

            choriste.niveau = nouveauStatut;

            choriste.historiqueStatut.push({ statut: nouveauStatut, date: new Date() });

            await choriste.save();
        }

        console.log('Mise à jour réussie pour tous les choristes');
    } catch (error) {
        console.error('Erreur lors de la mise à jour des statuts des choristes', error);
    }
});

// Démarrer la tâche planifiée
tacheMiseAJourStatut.start();

