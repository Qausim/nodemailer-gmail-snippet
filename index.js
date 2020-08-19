const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app
  .route('/sendemail')
  .post(async (req, res, next) => {
    const { EMAIL: email, PSWD: password } = process.env;
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password
      }
    });

    const mailOptions = {
      from: email,
      to: req.body.email,
      subject: req.body.name,
      html: `
        <h1>Tell me when you see it</h1>
        <h2>name: ${req.body.name}</h2>
        <h2>email: ${req.body.email}</h2>
        <h2>phone: ${req.body.phone}</h2>
        <h2>message: ${req.body.message}</h2>
      `
    };

    try {
      await transporter.sendMail(mailOptions)
      res.send('POST: DONE');      
    } catch (error) {
      console.log(error.message);
      res.send('An error occured');
    }
  });



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`app running on PORT: ${PORT}`));