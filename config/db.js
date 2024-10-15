const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the MONGO_URI environment variable or default to the local database
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/admin"; 
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });

    console.log('MongoDB Connected');
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
