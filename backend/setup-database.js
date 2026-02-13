const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Inquiry = require('./models/Inquiry');
const FollowUp = require('./models/FollowUp');

// Database setup function
const setupDatabase = async () => {
  try {
    console.log('Starting database setup...');
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas successfully!');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (!existingAdmin) {
      console.log('Creating admin user...');
      
      // Create admin user
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123'
      });
      
      console.log('Admin user created successfully!');
      console.log('Email: admin@example.com');
      console.log('Password: password123');
    } else {
      console.log('Admin user already exists');
    }

    // Create sample inquiry if none exist
    const inquiryCount = await Inquiry.countDocuments();
    
    if (inquiryCount === 0) {
      console.log('Creating sample inquiry...');
      
      const sampleInquiry = await Inquiry.create({
        referenceCode: `INQ${Date.now()}`, 
        name: 'Lasal Ranaweera',
        phone: '1234567890',
        email: 'Lasal@example.com',
        serviceType: 'Web Development',
        message: 'I need a website for my small business',
        status: 'New'
      });

      console.log('Sample inquiry created with reference code:', sampleInquiry.referenceCode);

      // Add a sample follow-up
      const sampleFollowUp = await FollowUp.create({
        inquiryId: sampleInquiry._id,
        note: 'Initial contact made. Client interested in WordPress solution. Scheduled follow-up call for next week.',
        nextFollowUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });

      console.log('Sample follow-up created');
    } else {
      console.log('Sample data already exists');
    }

    // Display collection info
    const userCount = await User.countDocuments();
    const inquiryTotal = await Inquiry.countDocuments();
    const followUpCount = await FollowUp.countDocuments();
    
    console.log('\nDatabase Summary:');
    console.log(`Users: ${userCount}`);
    console.log(`Inquiries: ${inquiryTotal}`);
    console.log(`Follow-ups: ${followUpCount}`);

    console.log('\nDatabase setup completed successfully!');
    console.log('\nYou can now start your application with:');
    console.log('   npm run dev');

  } catch (error) {
    console.error('Database setup failed:', error.message);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run setup
setupDatabase();