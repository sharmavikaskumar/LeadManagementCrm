// const jwt = require("jsonwebtoken");

// const protect = async (req, res, next) => {
//   let token;

//   // check authorization header
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       // get token
//       token = req.headers.authorization.split(" ")[1];

//       // verify token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // save user info in request
//       req.user = decoded;
//       console.log(decoded);

//       next();
//     } catch (error) {
//       return res.status(401).json({
//         message: "Not authorized, token failed",
//       });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({
//       message: "No token, authorization denied",
//     });
//   }
// };

// module.exports = { protect };

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      req.user = user;

      return next();
    }

    return res.status(401).json({
      message: "No token, authorization denied",
    });
  } catch (error) {
     //console.log(error);
    return res.status(401).json({
      message: "Not authorized, token failed",
    });
  }
};

module.exports = { protect };
