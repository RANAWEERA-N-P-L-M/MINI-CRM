const Inquiry = require('../models/Inquiry');
const FollowUp = require('../models/FollowUp');


exports.createInquiry = async (req, res) => {
  try {
    const { name, phone, email, serviceType, message } = req.body;

    // Validate required fields
    if (!name || !phone || !serviceType || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: name, phone, serviceType, and message'
      });
    }

    
    const newInquiry = await Inquiry.create({
      name,
      phone,
      email,
      serviceType,
      message
    });

    res.status(201).json({
      status: 'success',
      message: 'Inquiry submitted successfully!',
      data: {
        referenceCode: newInquiry.referenceCode,
        inquiry: newInquiry
      }
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit inquiry. Please try again.'
    });
  }
};

// Get all inquiries with pagination and filtering (Admin only)
exports.getInquiries = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    
    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Search by phone (partial match)
    if (req.query.phone) {
      filter.phone = { $regex: req.query.phone, $options: 'i' };
    }
    
    // Search by reference code (partial match)
    if (req.query.referenceCode) {
      filter.referenceCode = { $regex: req.query.referenceCode, $options: 'i' };
    }

    // Get inquiries with pagination
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Inquiry.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      status: 'success',
      data: {
        inquiries,
        pagination: {
          currentPage: page,
          totalPages,
          totalInquiries: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch inquiries'
    });
  }
};

// Get single inquiry with follow-ups (Admin only)
exports.getInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found'
      });
    }

    // Get all follow-ups for this inquiry
    const followUps = await FollowUp.find({ inquiryId: inquiry._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        inquiry,
        followUps
      }
    });
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch inquiry details'
    });
  }
};

// Update inquiry status (Admin only)
exports.updateInquiry = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['New', 'In Progress', 'In Action', 'Done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Inquiry status updated successfully',
      data: {
        inquiry
      }
    });
  } catch (error) {
    console.error('Update inquiry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update inquiry'
    });
  }
};

// Add follow-up to inquiry (Admin only)
exports.addFollowUp = async (req, res) => {
  try {
    const { note, nextFollowUpDate } = req.body;
    const inquiryId = req.params.id;

    // Validate required fields
    if (!note || !nextFollowUpDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both note and next follow-up date'
      });
    }

    // Check if inquiry exists
    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'Inquiry not found'
      });
    }

    // Create follow-up
    const followUp = await FollowUp.create({
      inquiryId,
      note,
      nextFollowUpDate: new Date(nextFollowUpDate)
    });

    res.status(201).json({
      status: 'success',
      message: 'Follow-up added successfully',
      data: {
        followUp
      }
    });
  } catch (error) {
    console.error('Add follow-up error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add follow-up'
    });
  }
};

// Track inquiry by reference code (Public route)
exports.trackInquiry = async (req, res) => {
  try {
    const { referenceCode } = req.params;

    // Validate reference code
    if (!referenceCode) {
      return res.status(400).json({
        status: 'error',
        message: 'Reference code is required'
      });
    }

    // Find inquiry by reference code
    const inquiry = await Inquiry.findOne({ referenceCode: referenceCode.toUpperCase() });
    
    if (!inquiry) {
      return res.status(404).json({
        status: 'error',
        message: 'No inquiry found with this reference code'
      });
    }

    // Get follow-ups for this inquiry
    const followUps = await FollowUp.find({ inquiryId: inquiry._id })
      .sort({ createdAt: -1 })
      .select('note createdAt'); // Only return note and date, not internal fields

    res.status(200).json({
      status: 'success',
      data: {
        inquiry: {
          referenceCode: inquiry.referenceCode,
          name: inquiry.name,
          serviceType: inquiry.serviceType,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
          updatedAt: inquiry.updatedAt
        },
        followUps
      }
    });
  } catch (error) {
    console.error('Track inquiry error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to track inquiry'
    });
  }
};