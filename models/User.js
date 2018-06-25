const mongoose = require('mongoose');

const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, unique:true},
  password: {type: String, required: true},
  confirmatiinCode: String,
  status: { type: String, enum: ['Active', 'Not Active' ] },
  email   : String,
  image   : String,
  bio     : String,
  _users: {type: Schema.Types.ObjectId, ref: 'User'}
  
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
