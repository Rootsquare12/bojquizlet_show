const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');

exports.join = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email: email,
      nickname: nick,
      password: hash,
      solved: 0,
      wrote: 0,
      like: 0,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
}
