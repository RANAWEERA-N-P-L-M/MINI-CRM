const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema for admin authentication
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Hash password before saving to database
userSchema.pre('save', async function(next) {
  
  if (!this.isModified('password')) return next();
  
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;