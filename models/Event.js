const mongoose = require('mongoose');

const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  eventName : {type: String, required: true},
  location: {type: String, required: true},
  date: {type: Date, required: true},
  time: {type: String, required: true},
  description:String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;