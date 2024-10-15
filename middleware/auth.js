// In your auth.js middleware
const jwt = require('jsonwebtoken');

const auth = (roles = []) => {
  return (req, res, next) => {
    // Extract token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1]; // Handle 'Bearer <token>' format
    if (!token) {
      return res.status(401).json({ message: 'Access Denied: No token provided.' });
    }

    try {
      // Verify the token
      const verified = jwt.verify(token, 'myHardcodedSecretKey');
      req.user = verified; // Attach user info to the request

      // Check for roles if provided
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Permission Denied: You do not have the right role.' });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      // Provide detailed error messages
      console.error('Token verification error:', error); // Log the error for debugging
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ message: 'Invalid Token' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token Expired. Please log in again.' });
      } else {
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  };
};

module.exports = auth;
