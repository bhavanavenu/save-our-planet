const express = require('express');
const router  = express.Router();
const User = require('../models/User');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET profile page
router.get('/auth/profile/:userId', (req, res, next) => {
let userId = req.params.userId;
User.findById(userId)
.then((user) =>{
  console.log(user);
  res.render('auth/profile', user);
})
});

// router.post('/auth/profile/:userId', (req, res, next) => {
//   let userId = req.params.userId;
//   User.findById(userId)
//   .then((user) =>{
//     console.log(user);
//     res.render('auth/profile', user);
//   })
//   });

// router.get('/event/new-event', (req, res, next) => {
//   res.render('event/new-event');
// });





module.exports = router;

