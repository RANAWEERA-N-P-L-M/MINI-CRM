const mongoose = require('mongoose');

// Inquiry Schema for client inquiries
const inquirySchema = new mongoose.Schema({
  referenceCode: {
    type: String,
    unique: true
    
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  serviceType: {
    type: String,
    required: [true, 'Service type is required'],
    enum: ['Web Development', 'Mobile App', 'Digital Marketing', 'Consulting', 'Other']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Won', 'Lost'],
    default: 'New'
  }
}, {
  timestamps: true 
});


inquirySchema.pre('save', function(next) {
  
  if (this.isNew && !this.referenceCode) {
    this.referenceCode = `INQ${Date.now()}`;
  }
  next();
});


inquirySchema.pre('validate', function(next) {
  
  if (this.isNew && !this.referenceCode) {
    this.referenceCode = `INQ${Date.now()}`;
  }
  next();
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;