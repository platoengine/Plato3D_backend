const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const usersSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

// hash the password
usersSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check to see if the password is valid

usersSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// make sure the same username can't register twice
usersSchema.methods.isUsernameUnique = function(cb) {
  return this.model('User').countDocuments({username: this.username}, cb);
};

// this method will compare the password
// in the current model with the one stored in the 'Users' database
usersSchema.methods.verifyPassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', usersSchema);
