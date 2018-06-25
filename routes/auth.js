const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const ensureLogin = require("connect-ensure-login");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;



authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const image = req.body.image;

  const role = req.body.role;
  if (username === "" || password === "" ) {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  // authRoutes.get("/auth/profile", (req, res, next) => {
  //   res.render("auth/profile", { "message": req.flash("error") });
  // });


  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const salt2 = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfirmation = bcrypt.hashSync(username, salt2);
    
    const message = "Please confirm your account! Click on the link.";


    const newUser = new User({
      username,
      email,
      confirmationCode: hashConfirmation,
      status: 'Not Active',
      image,
      password: hashPass,
      role:"teacher"
    });

    newUser.save((err) => {
      if (err) {
        console.log(err)
        res.render("auth/signup", { message: "Something went wrong"})
      
      } else {
      //  const message = Please confirm your account! Click on the link.`;

        let transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: process.env.GMAIL_EMAIL,
            pass: process.env.GMAIL_PASSWORD,
          }
        });
        transporter.sendMail({
          from: `"We are awesome" ${process.env.GMAIL_EMAIL}`,
          to: email, 
          subject: "your new account with BhavLaGio", 
           text: message,
          html: `<b>${message} <a href="http://localhost:3000/auth/confirm/${hashConfirmation}">Link</a></b>`

          //html: `Confirmation code: http://localhost:3000/auth/confirm/${hashConfirmation}`
        })
        .then(info => res.render("message", { email, subject, message, info }))
        .catch(error => console.log(error));
        res.redirect("/");
      }
    });
  
  });
});


authRoutes.get('auth/confirm/:hashConfirmation', (req,res,next) => {
  const confirmationCode = req.params.hashConfirmation;
  User.findOne({confirmationCode })
  .then(user => {
    User.findByIdAndUpdate(user._id, { status: 'Active' }).then(updatedUser => {
      res.render('auth/confirmation');
    });
  })
  .catch(err => {
    console.log('err');
    res.redirect('/');
  });
});


// authRoutes.get("/auth/profile", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("profile", { user: req.user });
// });

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// authRoutes.get('/auth/profile', (req, res, next) => {
//   res.render('auth/profile');
// });


module.exports = authRoutes;
