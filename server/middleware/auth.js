const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('=== Auth Middleware ===');
    console.log('Authorization header:', req.header('Authorization'));
    console.log('Token:', token);
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'my_super_secret_jwt_key_change_in_production_12345');
    console.log('Decoded token:', decoded);
    
    // Check if userId exists in token
    if (!decoded.userId) {
      console.log('Token missing userId - invalid or outdated token');
      return res.status(401).json({ 
        message: 'Invalid token format. Please log in again.',
        code: 'TOKEN_OUTDATED'
      });
    }
    
    req.userId = decoded.userId;
    console.log('User ID set to:', req.userId);
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};
