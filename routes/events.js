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
  let userId = req.user.id;
  console.log("DEBUG userId", userId);
  
    const {name,location,description,date,time} = req.body; 
    console.log("req.body", req.body);
    console.log("name,location,description,date,time", name,location,description,date,time);
    

  const newEvent = new Event({
    name,
    location,
    description,
    date,
    _owner: userId,
    _participants: [],
    comments: [],
    // time
  });
  User.findByIdAndUpdate(userId, { $push: {events: newEvent}}, {new:true})
  .then(()=>{
    newEvent.save()
    .then((event) => {

      res.redirect('/events')
    })
  })

  
    .catch((error) => {
      console.log(error)
    })

})

eventRoutes.get("/", (req, res) => {
  
    Event.find()
    .then((events)=>{
        res.render("events/event",{events})
    })
    .catch((error)=>{
        console.log(error)
    })
});

  eventRoutes.get('/:eventId', (req, res, next) => {
    let eventId = req.params.eventId;
    Event.findById(eventId)
    .populate('_participants comments._author _owner')

      .then(event => {
        console.log("event ", event);

        res.render("events/details",{event})
      })
      .catch(error => {
        console.log(error)
      })
  });

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
    })
    
  } )
   //{ $push: {_participants: req.user._id} }

})

//adding comments on the event page

eventRoutes.post('/:eventId/comment', (req, res, next) => {
  let eventId = req.params.eventId;
  let text = req.body.text;

  Event.findById(eventId)
  .then(event =>{
    console.log("old   ",event);
    
    event.comments.unshift({
      text,
      _author: req.user._id,
      createdAt: new Date()

    });
    event.save()
    .then(updatedEvent=>{
      res.redirect(`/events/${updatedEvent._id}`)
      // res.render('details', updatedEvent)
    })
    .catch(err=>{
      console.log(err)
    })
    
    })
  
  });


  //GET event-edit page
  // eventRoutes.get('/event-edit/:eventId', (req, res, next) => {
  //  let eventId = req.params.eventId;
  //  console.log('eventId',eventId)
  //   Event.findById(eventId)
  //     .then(event => {
  //       res.render('events/event-edit', {event});
  //     })
  //     .catch( err => { throw err } );
  // });

//edit event page
eventRoutes.get('/:eventId/edit', (req, res, next) => {
  Event.findById( req.params.eventId )
  .then( event=> {
      if (event._owner.toString() !== req.user._id.toString()) {
        res.redirect("/events")
      }
      else {
        res.render( 'events/event-edit', event );
      }
    })
    .catch( err => { throw err } );
});


//update event page
eventRoutes.post('/:eventId', (req, res, next) => {
  console.log("req body :", req.body)
  let { 
    name, 
    location,
    description,
    date 
    } = req.body;

    let updatedChanges = {name, 
      location,
      description,
      date
    }
  Event.findByIdAndUpdate( req.params.eventId, updatedChanges)
    .then( event => {
      console.log("event  ", event)
      res.redirect( `/events`);
    })
    .catch( err => { throw err } );
});


//delete event
eventRoutes.get('/:eventId/delete', (req, res, next) => {
  Event.findById( req.params.eventId )
    .then( event=> {
      console.log("DEBUG", event._owner.toString() , req.user._id.toString());
      console.log("DEBUG", event._owner.toString() === req.user._id.toString());
      if (event._owner.toString() === req.user._id.toString()) {
        Event.findByIdAndRemove(req.params.eventId)
        .then(() => res.redirect("/events"))
      }
      else {
        res.redirect("/events")
      }
    })
    .catch( err => { throw err } );
});

 module.exports = eventRoutes ;



