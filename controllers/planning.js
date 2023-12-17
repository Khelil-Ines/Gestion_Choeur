
// Déclarez la fonction principale comme asynchrone
// async function generateAndSaveSchedule(req, res) {
//   try {
//     const {
//       startDate,
//       endDate,
//       sessionStartTime,
//       sessionEndTime,
//       auditionDuration,
//       candidatesPerHour,
//     } = req.params;

//     const planningData = [];
//     const candidatesList = await getCandidates();

//     const currentDay = moment(startDate);
//     const lastDay = moment(endDate);

//     while (currentDay.isSameOrBefore(lastDay)) {
//       const day = {
//         dateAudition: currentDay.toDate(),
//         sessions: [],
//       };

//       let currentSessionStartTime = moment(`${currentDay.format('YYYY-MM-DD')} ${sessionStartTime}`);

//       while (currentSessionStartTime.isSameOrBefore(moment(`${currentDay.format('YYYY-MM-DD')} ${sessionEndTime}`))) {
//         const sessionEnd = moment(currentSessionStartTime).add(auditionDuration, 'minutes');

//         const session = {
//           startTime: currentSessionStartTime.format('HH:mm'),
//           endTime: sessionEnd.format('HH:mm'),
//           candidates: [],
//         };

//         for (let j = 0; j < candidatesPerHour; j++) {
//           const candidate = await getCandidate(candidatesList, currentSessionStartTime, sessionEnd, auditionDuration);

//           if (candidate) {
//             session.candidates.push({
//               candidateId: candidate.candidateId,
//               auditionStartTime: candidate.auditionStartTime,
//               auditionDuration: auditionDuration,
//             });
//           } else {
//             console.error('Erreur : Aucun candidat disponible.');
//           }
//         }

//         day.sessions.push(session);
//         currentSessionStartTime = sessionEnd; // Passez à la prochaine session
//       }

//       planningData.push(day);
//       currentDay.add(1, 'day');
//     }

//     for (const day of planningData) {
//       for (const session of day.sessions) {
//         for (let j = 0; j < session.candidates.length; j++) {
//           const candidate = session.candidates[j];
//           const auditionStartTime = moment(session.startTime, 'HH:mm').add(j * auditionDuration, 'minutes').format('HH:mm');

//           const newPlanning = new Planning({
//             dateAudition: day.dateAudition,
//             candidates: [
//               {
//                 candidateId: candidate.candidateId,
//                 auditionStartTime: auditionStartTime,
//                 auditionDuration: candidate.auditionDuration,
//               },
//             ],
//           });

//           await newPlanning.save();
//         }
//       }
//     }

//     res.json({ message: 'Planification générée et enregistrée avec succès.' });
//   } catch (error) {
//     console.error('Erreur lors de la génération de la planification :', error);
//     res.status(500).json({ error: 'Erreur interne du serveur' });
//   }
// }

// // Déclarez getCandidates comme fonction asynchrone
// async function getCandidates() {
//   try {
//     // Récupérer tous les candidats depuis la base de données
//     const candidates = await Candidate.find();

//     // Créer une liste des candidats avec leurs IDs et d'autres propriétés nécessaires
//     const candidatesWithIds = candidates.map(candidate => ({
//       candidateId: candidate._id,
//       // Ajoutez d'autres propriétés du candidat selon vos besoins
//     }));

//     return candidatesWithIds;
//   } catch (error) {
//     console.error('Erreur lors de la récupération des candidats :', error);
//     throw error; // Vous pouvez gérer cette erreur en conséquence
//   }
// }

// // Déclarez getCandidate comme fonction asynchrone
// let selectedCandidatesIndexes = [];

// async function getCandidate(candidatesList, currentSessionStartTime, sessionEnd, auditionDuration) {
//   // Vérifiez s'il reste des candidats non sélectionnés
//   if (selectedCandidatesIndexes.length === candidatesList.length) {
//     // Tous les candidats ont été sélectionnés, réinitialisez la liste des indices sélectionnés
//     selectedCandidatesIndexes = [];
//   }

//   // Sélectionnez le prochain candidat non sélectionné dans l'ordre de la liste
//   const remainingCandidatesIndexes = candidatesList
//     .map((_, index) => index)
//     .filter(index => !selectedCandidatesIndexes.includes(index));

//   const nextCandidateIndex = remainingCandidatesIndexes[0];

//   // Ajoutez l'index du candidat sélectionné à la liste des indices sélectionnés
//   selectedCandidatesIndexes.push(nextCandidateIndex);

//   const selectedCandidate = candidatesList[nextCandidateIndex];
//   const auditionStartTime = currentSessionStartTime.clone().add(nextCandidateIndex * auditionDuration, 'minutes');

//   // Vérifiez si l'heure d'audition ne dépasse pas la fin de la session
//   if (auditionStartTime.isSameOrBefore(sessionEnd)) {
//     return { ...selectedCandidate, auditionStartTime: auditionStartTime.format('HH:mm') };
//   } else {
//     // Si l'heure d'audition dépasse la fin de la session, réessayez avec un autre candidat
//     return await getCandidate(candidatesList, currentSessionStartTime, sessionEnd, auditionDuration);
//   }
// }


