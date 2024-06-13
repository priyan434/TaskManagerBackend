const jwt = require('jsonwebtoken');
require("dotenv").config();

const jwt_secret_key = process.env.JWT_SECRET_KEY || 'taskmanager'; 

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
  
    if (!token) {
      return res.status(401).send('Access denied: No token provided');
    }
  
    try {
      const decoded = jwt.verify(token, jwt_secret_key);
      req.user = decoded._id; 
      next()
    } catch (err) {
      console.error(err);
      return res.status(401).send('Access denied: Invalid authentication token');
    }
  };
  module.exports={auth}