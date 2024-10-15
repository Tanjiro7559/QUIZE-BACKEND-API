const Test = require('../models/Test');
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Create a test (Admin and Sub-Admin only)
exports.createTest = async (req, res) => {
  const { title, subject, questions, startTime, duration } = req.body;

  // Check if the user is an admin or sub-admin
  if (req.user.role !== 'admin' && req.user.role !== 'sub-admin') {
    return res.status(403).json({ message: 'Only admins and sub-admins can create tests.' });
  }

  try {
    const test = new Test({
      title,
      subject,
      questions,
      startTime,
      duration,
      createdBy: req.user._id,
      approvedByAdmin: false, // Initially not approved
      approvedAt: null, // Initially null
    });

    await test.save();
    res.status(201).json({ message: 'Test created, pending admin approval.', test });
  } catch (err) {
    console.error('Error creating test:', err.message); // Log the error for debugging
    res.status(400).json({ message: 'Error creating test: ' + err.message });
  }
};

// Approve a test (Admin only)
exports.approveTest = async (req, res) => {
  const { id } = req.params; // Get test ID from request parameters

  // Check if the user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can approve tests.' });
  }

  try {
    const test = await Test.findById(id);
    if (!test) return res.status(404).json({ message: 'Test not found.' });

    // Approve the test
    test.approvedByAdmin = true;
    test.approvedAt = new Date();
    await test.save();

    res.json({ message: 'Test approved successfully.', test });
  } catch (err) {
    console.error('Error approving test:', err.message); // Log the error for debugging
    res.status(400).json({ message: 'Error approving test: ' + err.message });
  }
};

// View approved tests
exports.viewApprovedTests = async (req, res) => {
  try {
    const tests = await Test.find({ approvedByAdmin: true });
    res.json(tests);
  } catch (err) {
    console.error('Error fetching approved tests:', err.message); // Log the error for debugging
    res.status(400).json({ message: 'Error fetching approved tests: ' + err.message });
  }
};
exports.getTest = async (req, res) => {
    const { id } = req.params;
  
    try {
      const test = await Test.findById(id);
      if (!test) return res.status(404).json({ message: 'Test Not Found' });
  
      res.status(200).json(test);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.getAllTests = async (req, res) => {
    try {
      const tests = await Test.find();
      res.status(200).json(tests);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  // Attend Test
  exports.attendTest = async (req, res) => {
    const { testId } = req.params;
    
    try {
      const test = await Test.findById(testId);
      if (!test) return res.status(404).json({ message: 'Test Not Found' });
      
      res.status(200).json(test); // Send test details for the user to take the test
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  // submit
  exports.submitTest = async (req, res) => {
    const { testId, answers } = req.body;

    try {
        const test = await Test.findById(testId);
        if (!test) return res.status(404).json({ message: 'Test Not Found' });

        if (answers.length !== test.questions.length) {
            return res.status(400).json({ message: 'Invalid number of answers submitted.' });
        }

        // Calculate score
        let score = 0;
        test.questions.forEach((question, index) => {
            if (question.correctAnswer === answers[index]) score++; // Compare correctAnswer
        });

        // Save the result in the user's profile
        await User.findByIdAndUpdate(req.user._id, {
            $push: { results: { testId, score, date: new Date() } }
        });

        res.send({ message: 'Test Submitted', score });
    } catch (err) {
        console.error('Error while submitting test:', err); // Logging for better debugging
        res.status(400).json({ error: err.message });
    }
};

  



  exports.getUserDashboard = async (req, res) => {
    try {
        // Log the user ID being queried
        console.log('Fetching dashboard for user ID:', req.user._id);

        // Find the user by their ID, including populated results
        const user = await User.findById(req.user._id).populate('results.testId');

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        // Calculate total tests taken
        const { results } = user;
        const totalTestsTaken = results.length;

        // Respond with the user's dashboard data
        res.status(200).json({
            totalTestsTaken,
            results,
        });
    } catch (err) {
        // Log the error and return a 500 status code for unexpected errors
        console.error('Error fetching user dashboard:', err.message);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}; 

