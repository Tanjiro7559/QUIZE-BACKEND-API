const express = require('express');
const testController = require('../controllers/testController');
const auth = require('../middleware/auth'); // Assuming you have an authentication middleware
const router = express.Router();

// Routes for managing tests
router.post('/create', auth(['sub-admin', 'admin']), testController.createTest); // Create Test
router.put('/approve/:id', auth(['admin']), testController.approveTest); // Approve Test
router.get('/view-tests', auth(['user']), testController.viewApprovedTests); // View Approved Tests

// Routes for user functionalities
router.get('/', auth(['user']), testController.getAllTests); // Get All Tests
router.get('/:id', auth(['user']), testController.getTest); // Get Single Test
router.get('/attend/:testId', auth(['user']), testController.attendTest); // Attend Test
router.post('/submit', auth(['user']), testController.submitTest); // Submit Test
router.get('/user/dashboard', auth(['user']), testController.getUserDashboard);
// Get User Dashboard

module.exports = router;
