const jwt = require("jsonwebtoken");
const Compte = require("../models/compte");
const Choriste = require ("../models/choriste");

// module.exports.verifyToken = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(' ')[1];
//     const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

//     const choristeId = decodedToken.choristeId;
    
//     // Utilisation de async/await pour rendre la recherche de l'utilisateur plus propre
//     const userModel = await UserModels.findOne({ _id: choristeId });

//     if (!userModel) {
//       return res.status(404).json({
//         message: 'User non trouvé!',
//       });
//     }

//     // Ajout des données d'authentification à req.auth
//     req.auth = {
//       choristeId: choristeId,
//       role: userModel.role,
//     };

//     next();
//   } catch (error) {
//     return res.status(401).json({ error: error.message });
//   }
//};




module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const compteId = decodedToken.compteId;

    Compte.findOne({ _id: compteId })
    .then((compte) => {
       if (!compte) {
          return res.status(401).json({ message: "login ou mot de passe incorrecte " });
       } else {
          req.auth = {
             compteId: compteId,
             role: compte.role,
          };
          next();
       }
    })
    .catch((error) => {
       res.status(500).json({ error: error.message });
    });
 
  } catch (error) {
    res.status(401).json({ error });
  }
};


module.exports.isChoriste = async (req, res, next) => {
try{
  const choriste = await Choriste.findOne({ compte: req.auth.compteId });
console.log(choriste)

    if(choriste)
    {
      next();}
      else {
        res.status(403).json({ error:"no access to this route" });
      } 
}
catch(error)
{
  res.status(401).json({ error:error.message });
}
};

module.exports.isAdmin = (req, res, next) => {
  try{
      if(req.auth.__t === "Admin")
      {
        next();}
        else {
          res.status(403).json({ error:"no access to this route" });
        } 
  }
  catch(e)
  {
    res.status(401).json({ e:e.message });
  }
  };

  module.exports.isChefPupitre = (req, res, next) => {
    try{
        if(req.auth.__t === "Chef_Pupitre")
        {
          next();}
          else {
            res.status(403).json({ error:"no access to this route" });
          } 
    }
    catch(e)
    {
      res.status(401).json({ e:e.message });
    }
    };

