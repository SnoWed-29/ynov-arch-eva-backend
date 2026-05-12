const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Profile = require('../models/profile.model');

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, address } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    await Profile.create({ user_id: user.id, first_name, last_name, phone, address });

    const token = generateToken(user);
    return res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    return res.status(200).json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.verifyToken = (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: require('../models/profile.model'), as: 'Profile' }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Could not fetch user', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, phone, address } = req.body;
    const [profile, created] = await require('../models/profile.model').upsert({
      user_id: req.user.id, first_name, last_name, phone, address,
    });
    return res.status(200).json({ message: 'Profile updated', profile });
  } catch (err) {
    return res.status(500).json({ message: 'Update failed', error: err.message });
  }
};