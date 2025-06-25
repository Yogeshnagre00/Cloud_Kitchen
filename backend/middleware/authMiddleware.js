const jwt = require("jsonwebtoken");

<<<<<<< HEAD
// Middleware to authenticate requests using JWT
=======
>>>>>>> 0cca3db4d70e4b7559b5429ce182a00babd1f8d2
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

<<<<<<< HEAD
  // Extract the token from the Authorization header
=======
>>>>>>> 0cca3db4d70e4b7559b5429ce182a00babd1f8d2
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
<<<<<<< HEAD
    req.user = decoded; 
=======
    req.user = decoded; // add user info to request
>>>>>>> 0cca3db4d70e4b7559b5429ce182a00babd1f8d2
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = authMiddleware;
