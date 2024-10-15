const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).send('User Registered');
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send('Invalid Credentials');
  
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) return res.status(400).send('Invalid Credentials');
  
      // Generate JWT token with hardcoded secret
      const token = jwt.sign({ _id: user._id, role: user.role }, 'myHardcodedSecretKey', { expiresIn: '1h' });

      // Return the token in the response
      res.header('Authorization', token).send({ message: 'Logged In', token });
    } catch (err) {
      res.status(400).send(err.message);
    }
  };
