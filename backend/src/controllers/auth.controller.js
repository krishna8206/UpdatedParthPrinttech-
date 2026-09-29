const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readDb, writeDb } = require('../data/db');
const { JWT_SECRET } = require('../middleware/auth');

exports.login = async (req, res) => {
  try {
    const rawIdentifier = req.body.email || req.body.username || '';
    const identifier = rawIdentifier.trim().toLowerCase();
    const password = (req.body.password || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/Username and password are required.' });
    }

    // Static master login credentials requested by admin:
    // email: admin@gmail.com, password: admin123 (also supports username: admin)
    const isStaticValid = (identifier === 'admin@gmail.com' || identifier === 'admin') && password === 'admin123';

    let isValid = isStaticValid;
    const db = readDb();
    const admin = db.admin || {};

    if (!isValid) {
      const matchesUser = admin.username?.toLowerCase() === identifier || admin.email?.toLowerCase() === identifier;
      if (matchesUser && admin.passwordHash) {
        isValid = await bcrypt.compare(password, admin.passwordHash);
      }
    }

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { username: 'admin', email: 'admin@gmail.com', name: admin.name || 'Super Admin' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        username: 'admin',
        email: 'admin@gmail.com',
        name: admin.name || 'Super Admin'
      }
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.getMe = (req, res) => {
  const db = readDb();
  res.json({
    success: true,
    user: {
      username: db.admin.username,
      name: db.admin.name || 'Admin'
    }
  });
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const db = readDb();
    const admin = db.admin;

    let isMatch = false;
    if (admin.passwordHash) {
      isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
    }
    if (!isMatch && currentPassword === 'admin123') {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    writeDb(db);

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    console.error('[Auth] Update password error:', err);
    res.status(500).json({ success: false, message: 'Error updating password.' });
  }
};
