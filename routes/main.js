const express = require('express');
const nodemailer = require('nodemailer');
const config = require('../config.json');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const pathToData = path.join(process.cwd(), 'data.json'); 


router.get('/', (req, res) => {
  const msgemail = req.flash("message")[0]
  fs.readFile(pathToData, 'utf8', (error, data) => {
    if (!error) {
      const parsedData = JSON.parse(data);
      res.render('pages/index', {
        title: 'Main page',
        products: parsedData.products,
        skills: parsedData.skills,
        msgemail
      });
    }
  });
});

router.post('/', (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.message) {
    req.flash('message', 'Необходимо заполнить все поля.');
    return res.redirect('/');
  }

  const transporter = nodemailer.createTransport(config.mail.smtp);

  const mailData = {
    from: `"${req.body.name}" <${req.body.email}>`,
    to: config.mail.smtp.auth.user,
    subject: config.mail.subject,
    text:
      req.body.message.trim().slice(0, 500) +
      `\n Отправлено с: <${req.body.email}>`
  };

  transporter.sendMail(mailData, function (error) {
    if (error) { 
      req.flash('message', 'Что-то пошло не так. Попробуйте снова.');
      res.redirect('/');
    } 
      
    req.flash('message', 'Сообщение успешно отправлено!');
    res.redirect('/');
  });
});

module.exports = router;
