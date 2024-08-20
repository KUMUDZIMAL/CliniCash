const jwt = require('jsonwebtoken');
const User = require('../routes/users'); // Ensure this path is correct
const { ACCESS_TOKEN_SECRET } = require('../routes/generateKeys'); // Adjust path if necessary

const auth = async (req, res, next) => {
  try {
    // Extract the token from cookies
    const token = req.cookies.jwt; // Ensure you are using a library to parse cookies
    if (!token) {
      return res.status(401).render('loginFirst')
    }

    // Verify the token
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    // Find the user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: 'User not found.' });
    }

    // Attach user to the request object
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token expired. Please log in again.' });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).render('invalidToken')
    } else {
      console.error('Authentication error:', err);
      return res.status(500).json({ msg: 'Server error' });
    }
  }
};

module.exports = auth;
