const jwt = require('jsonwebtoken');
const {User} = require('../models');

exports.createToken = async (req, res) => {
  try {
    const token = jwt.sign({
      nick: req.body.user,
    }, process.env.JWT_SECRET, {
      expiresIn: '30m', // 30분
      issuer: 'rootsquare',
    });
    return res.json({
      code: 200,
      message: 'You Got a Token!',
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      code: 500,
      message: 'Server Error',
    });
  }
};

exports.tokenTest = (req, res) => {
  res.json(res.locals.decoded);
};