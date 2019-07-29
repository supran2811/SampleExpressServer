const pino = require('../utils/logger');
const User = require('../models/user');
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.postLogin = async (req, res) => {
  try {
    req.session.isLoggedIn = true;
    const user = await User.findById('5d3a56cf7766903d4857710b');
    req.session.user = user;
  } catch (error) {
    pino.error(error);
  }
  res.redirect("/");
}

exports.postLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      pino.error(err);
    }
    res.redirect("/");
  });

}