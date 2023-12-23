const jwt = require("jsonwebtoken");
const UserModels = require("../models/compte");

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
    const userId = decodedToken.userId;

    UserModels.findOne({_id:userId})
      .then((UserModel) => {
        if (!UserModel) {
          res.status(404).json({
            message: "User non trouvé!",
          });
          
        } else {
          req.auth = {
            userId: userId,
            role:UserModel.role
          };
          next();
        }
      })
      .catch(() => {
        res.status(400).json({
          error: Error.message,
          message: "Données inva!ide",
        });
      });
   

  } catch (error) {
    res.status(401).json({ error:error.message });
  }
};


// module.exports.isadmin = (req, res, next) => {
// try{
//     if(req.auth.role === "admin")
//     {
//       next();}
//       else {
//         res.status(403).json({ error:"no access to this route" });
//       }
    
// }

// catch(e)
// {
//   res.status(401).json({ e:e.message });

// }

// };


