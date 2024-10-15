// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['user', 'admin', 'sub-admin'], default: 'user' },
// }, { timestamps: true });

// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Email must be unique
  password: { type: String, required: true }, // Password must be provided
  role: { 
    type: String, 
    enum: ['user', 'admin', 'sub-admin'], // Allowable roles
    default: 'user' // Default role is 'user'
  },
  results: [{
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' }, // Reference to Test model
    score: { type: Number }, // Store the score achieved in the test
    date: { type: Date, default: Date.now } // Date of the test submission
  }]
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Pre-save middleware to hash the password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Skip if password not modified
  const salt = await bcrypt.genSalt(10); // Generate salt
  this.password = await bcrypt.hash(this.password, salt); // Hash password
  next(); // Proceed to save the user
});

// Create User model
const User = mongoose.model('User', userSchema);
module.exports = User; // Export the User model
