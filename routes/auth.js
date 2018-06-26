const express = require("express");
const passport = require('passport');
const authRoutes = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const ensureLogin = require("connect-ensure-login");
const nodemailer = require("nodemailer");
require("dotenv").config();

const message = "Please confirm your account! Click on the link.";


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  }
});

//GET login
authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

//POST login
authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/auth/profile",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}));
// GET signup
authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//POST signup
authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const bio =req.body.bio;
  //const image = req.body.image;
  const role = req.body.role;
  if (username === "" || password === "" || email === "" ) {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  
  
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const salt2 = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfirmation = bcrypt.hashSync(username, salt2).replace(/\//g, '');
    
    
    
    const newUser = new User({
      username,
      password: hashPass,
      email,
      confirmationCode: hashConfirmation,
      status: 'Not Active',
      // image,
      role:"teacher"
    });
    
    newUser.save((err) => {
      if (err) {
        console.log(err)
        res.render("auth/signup", { message: "Something went wrong"})
        
      } else {
        
        
        
        transporter.sendMail({
          from: `"Save our Planet" ${process.env.GMAIL_EMAIL}`,
          to: email, 
          subject: "Congratulations for being a part of the change", 
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

// confirmation
authRoutes.get('/auth/confirm/:hashConfirmation', (req,res,next) => {
  //const confirmationCode = req.params.hashConfirmation;
  User.findOne({confirmationCode : req.params.hashConfirmation})
  .then(user => {
    User.findByIdAndUpdate(user._id, { status: 'Active' })
    .then(updatedUser => {
      res.render('auth/confirmation', updatedUser);
    });
  })
  .catch(err => {
    console.log('err');
    res.redirect('/');
  });
});




authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// authRoutes.get('/auth/profile', (req, res, next) => {
//   res.render('auth/profile');
// });
authRoutes.get("/profile", (req, res) => {
  console.log(req.user)

  res.render("auth/profile", req.user);
});


//Update changes
authRoutes.post("/profile",(req, res) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  let id = req.user._id;
  const {username, email, password, bio} = req.body;
  const hashPass = bcrypt.hashSync(password, salt);
  
  var updateChanges = {username, email, password: hashPass, bio};
  

  User.findByIdAndUpdate(id, updateChanges)
  .then(() => {
    res.redirect(`/auth/profile/`);
  })
  .catch(error => {
    next();
  })
});
module.exports = authRoutes;

