const jwt = require('jsonwebtoken');
const { getUsers, findUserByEmail, findUserById } = require('../services/dataService');
const { JWT_SECRET, ROLE_ALLOWED_STATUSES, canHardDeleteRole } = require('../middleware/auth');

/**
 * POST /api/auth/login
 * User login with email & password
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // In demo environment, accept 'password123', 'demo', or matched password
    if (password && password !== user.password && password !== 'demo' && password !== 'password123') {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title,
      avatar: user.avatar,
      allowedStatuses: ROLE_ALLOWED_STATUSES[user.role],
      canHardDelete: canHardDeleteRole(user.role),
    };

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
};

/**
 * GET /api/auth/users
 * Returns list of team members
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    const safeUsers = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      title: u.title,
      avatar: u.avatar,
    }));
    return res.status(200).json({ success: true, count: safeUsers.length, users: safeUsers });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users', error: error.message });
  }
};

/**
 * GET /api/auth/me
 * Returns current authenticated user
 */
const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const safeUser = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      title: req.user.title,
      avatar: req.user.avatar,
      allowedStatuses: ROLE_ALLOWED_STATUSES[req.user.role],
      canHardDelete: canHardDeleteRole(req.user.role),
    };
    return res.status(200).json({ success: true, user: safeUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

module.exports = { login, getAllUsers, getMe };

