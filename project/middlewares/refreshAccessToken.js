const jwt = require('jsonwebtoken');
const User = require('../routes/users'); // Ensure this path is correct
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../routes/generateKeys'); // Adjust path if necessary

const refreshAccessToken = async (req, res, next) => {
  try {
    const accessToken = req.cookies.jwt;
    const refreshToken = req.cookies.refreshToken; // Get the refresh token from cookies

    if (!accessToken) {
      return res.status(401).json({ msg: 'Access token is missing.' });
    }

    // Verify the access token
    try {
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      // If token is valid, proceed to the next middleware
      return next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // Access token is expired, now try to refresh it
        if (!refreshToken) {
          return res.status(401).json({ msg: 'Refresh token is missing.' });
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        if (!decoded) {
          return res.status(401).json({ msg: 'Invalid refresh token.' });
        }

        // Find the user by ID
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
          return res.status(401).json({ msg: 'User not found or refresh token mismatch.' });
        }

        // Generate a new access token
        const newAccessToken = jwt.sign({ id: user._id, username: user.username }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

        // Set new access token in HTTP-only cookie
        res.cookie('jwt', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000, // 1 hour
          sameSite: 'Strict'
        });

        // Proceed with the request with the new access token
        req.user = user; // Attach user to the request object
        return next();
      } else {
        // If token is not expired, send an error response
        return res.status(401).json({ msg: 'Invalid token.' });
      }
    }
  } catch (err) {
    console.error('Error in refreshAccessToken middleware:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = refreshAccessToken;
