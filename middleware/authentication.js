// require("dotenv").config();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
  //check for header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid');
  }

  const token = authHeader.split(' ')[1];
  // console.log(token);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    //Alternatively
    // const user = User.findById(payload.id).select('-password');
    // req.user = user;

    //Attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    // localStorage.removeItem(token);

    throw new UnauthenticatedError('Authentication invalid');
  }
};

module.exports = auth;
