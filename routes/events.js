const express = require("express");
const passport = require('passport');
const eventRoutes = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const router = express.Router();
const ensureLogin = require("connect-ensure-login");
const nodemailer = require("nodemailer");

//adding a middleware to make protected route
eventRoutes.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  });

  //GET new event page
eventRoutes.get('/new-event',(req,res,next)=>{
    res.render('events/new-event');
});

eventRoutes.post('/new-event',(req,res,next)=>{
    const {name,location,description,date,time} = req.body; 
    console.log("req.body", req.body);
    console.log("name,location,description,date,time", name,location,description,date,time);
    

    const newEvent = new Event ({
        name,
        location,
        description,
        date,
        _participants:[],
        comments:[],
        // time
    });
    newEvent.save()
    .then((event)=>{
                res.redirect('/events')
            })
                .catch((error)=>{
                    console.log(error)
            })

})

eventRoutes.get("/", (req, res) => {
    Event.find()
    .then((events)=>{
        console.log(events)
        res.render("events/event",{events})
    })
    .catch((error)=>{
        console.log(error)
    })
});

  eventRoutes.get('/:eventId', (req, res, next) => {
    let eventId = req.params.eventId;
    Event.findById(eventId)
    .populate('_participants')
      .then(event => {
        const participants = event._participants;
        res.render("events/details",{event, partcipants: participants})
      })
      .catch(error => {
        console.log(error)
      })
  });

//edit event 
  // eventRoutes.get('/:eventId/edit', (req, res, next) => {
   // let eventId = req.params.eventId;
  //   Event.findById( req.params.eventId )
  //     .then( event => {
  //       res.render( 'events/event-edit', {event});
  //     })
  //     .catch( err => { throw err } );
  // });

eventRoutes.get('/:eventId/join',(req,res,next)=>{
  const joiningUserId = req.user._id;
  let eventId = req.params.eventId;
  Event.findById(eventId)
  .then( event => {
    event._participants.push( joiningUserId );
    event.save( (err, updatedEvent) => {
      if ( err ) {
        console.log( err )
      } else {
        res.redirect(`/events/${updatedEvent._id}`)
      }
    } )
  } )
   //{ $push: {_participants: req.user._id} }

})


 module.exports = eventRoutes ;




       

    