// const nodemailer = require('nodemailer');
// require("dotenv").config();

// router.post('/send-email', (req, res, next) => {
//     let { email, subject, message } = req.body;
//     let transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//             user: process.env.GMAIL_EMAIL,
//             pass: process.env.GMAIL_PASSWORD,

//       }
//     });
//     transporter.sendMail({
//       from: '"My Awesome Project 👻" <appusreelakshmi1990@gmail.com>',
//       to: email, 
//       subject: `Confirmation mail`, 
//       text: `Cngratulatins for being part of a change`,
//       html: `<b>${message}</b>`
//     })
//     .then(info => res.render('message', {email, subject, message, info}))
//     .catch(error => console.log(error));
//   });
  
  
//   module.exports = router;
  

//   newUser.save((err) => {
//     if (err) {
//       console.log(err)
//       res.render("auth/signup", { message: "Something went wrong"})
    
//     } else {
     
//     });