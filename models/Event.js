const mongoose = require('mongoose');

const Schema   = mongoose.Schema;

const eventSchema = new Schema({
  name : {type: String, required: true},
  location: {type: String, required: true},
  date: {type: Date, required: true},
  description:String,
  _participants: [{type: Schema.Types.ObjectId, ref: "User"}],
  comments: [{
    text: String,
    _author: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date }
  }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;