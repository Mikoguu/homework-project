const express = require('express');
const router = express.Router();
require('dotenv').config();


router.get('/', (req, res, next) => {
  const session = req.session;

  if (session.isLoggedIn) {
    res.redirect('/admin')
  } else {
    res.render('pages/login')
  }
});

router.post('/', (req, res, next) => {
  if (req.body.email === process.env.LOGIN && req.body.password === process.env.PASSWORD) {
    req.session.isLoggedIn = true;
    res.redirect('/admin');
  } else {
    res.render('pages/login', { showError: true })
  }
});

module.exports = router;

