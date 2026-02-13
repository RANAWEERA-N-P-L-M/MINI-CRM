const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes - only authenticated users can access
exports.protect = async (req, res, next) => {
  try {
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in! Please log in to get access.'
      });
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token does no longer exist.'
      });
    }

    
    req.user = currentUser;
    next();
  } catch (error) {
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again!'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Your token has expired! Please log in again.'
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong during authentication'
      });
    }
  }
};


exports.isLoggedIn = async (req, res, next) => {
  try {
    
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    
    req.user = currentUser;
    next();
  } catch (error) {
    
    return next();
  }
};