const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { jwtkey } = require('../config/key');
const router = express.Router();
const User = mongoose.model('User');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, (req, res) => {
  res.send('your email is ' + req.user.email);
});

router.post('/signup', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, jwtkey, { expiresIn: '1d' });
    res.json({
      mesage: 'Sucessfully insert User',
      token: token,
    });
  } catch (err) {
    res.status(422).send(err.message);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ error: 'Please must provide email and password' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(422)
      .json({ error: 'Please must provide email and password' });
  }
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, jwtkey, { expiresIn: '1d' });
    res.json({ msg: 'Successfully Siginin', token });
  } catch (err) {
    return res
      .status(422)
      .json({ error: 'Please must provide email and password' });
  }
});

module.exports = router;
