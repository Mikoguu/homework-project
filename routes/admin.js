const express = require('express');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

const router = express.Router();
const pathToData = path.join(process.cwd(), 'data.json'); 

router.get('/', (req, res) => {
  const session = req.session;

  if (session.isLoggedIn) {
    fs.readFile(pathToData, 'utf8', (error, data) => {
      if (!error) {
        const parsedData = JSON.parse(data);

        res.render('pages/admin', { title: 'Admin page', skills: parsedData.skills });
      }
    });
  } else {
    res.redirect('/login');
  };
})

router.post('/skills', (req, res) => {
  fs.readFile(pathToData, 'utf8', (error, data) => {
    if (!error) {
      const parsedData = JSON.parse(data);

      parsedData.skills[0].number = req.body.age;
      parsedData.skills[1].number = req.body.concerts;
      parsedData.skills[2].number = req.body.cities;
      parsedData.skills[3].number = req.body.years;
      
      fs.writeFile(pathToData, JSON.stringify(parsedData), (error) => {
        if (error) {
          console.error(error);

          return;
        }

        res.render('pages/admin', { title: 'Admin page', skills: parsedData.skills });
      });
    }
  });
})

router.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();

  form.uploadDir = path.join(process.cwd(), '/public/assets/img/products');

  form.parse(req, function (_error, fields, files) {
      const extension = files.photo[0].mimetype.split('/')[1];
      const fullFileName = `${files.photo[0].filepath}.${extension}`;

      fs.rename(files.photo[0].filepath, fullFileName, function (err) {
          if (err) {
            console.error(err.message);

            return;
          }

          fs.readFile(pathToData, 'utf8', (error, data) => {
            if (!error) {
              const parsedData = JSON.parse(data);
              const baseName = `${files.photo[0].newFilename}.${extension}`;

              parsedData.products.push({
                src: `./assets/img/products/${baseName}`,
                name: `${fields.name}`,
                price: `${fields.price}`
              });
                
              fs.writeFile(pathToData, JSON.stringify(parsedData), (error) => {
                if (error) {
                  console.error(error);
                }
              });
            }
          });
      });
  });

  res.redirect('/admin');
});

module.exports = router;
