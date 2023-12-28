exports.choristeActif = (req, res, next) => {
    try {
        if (req.auth.statut === "Actif") {
          next();
        } else {
          res.status(403).json({ error: "Pas de notif : Ce choriste est en congé " });
        }
      } catch (error) {
        res.status(401).json({ error: error.message });
      }
  };
