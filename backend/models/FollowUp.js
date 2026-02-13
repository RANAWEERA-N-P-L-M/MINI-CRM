const mongoose = require('mongoose');

// FollowUp Schema for tracking inquiry follow-ups
const followUpSchema = new mongoose.Schema({
  inquiryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inquiry', 
    required: [true, 'Inquiry ID is required']
  },
  note: {
    type: String,
    required: [true, 'Follow-up note is required'],
    trim: true
  },
  nextFollowUpDate: {
    type: Date,
    required: [true, 'Next follow-up date is required']
  }
}, {
  timestamps: true 
});


followUpSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'inquiryId',
    select: 'referenceCode name phone email serviceType status'
  });
  next();
});

const FollowUp = mongoose.model('FollowUp', followUpSchema);

module.exports = FollowUp;