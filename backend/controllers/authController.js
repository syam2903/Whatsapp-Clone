import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, profilePic } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({
    name,
    email,
    password,
    profilePic
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      status: user.status,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const authUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);
  const user = await User.findOne({ email }).select('+password');
  console.log('Fetched user at login:', user);
  if (!user) {
    console.error('Login failed: user not found for', email);
    res.status(401);
    throw new Error('Invalid email or password');
  }
  console.log('Entered password:', password);
  const isMatch = await user.matchPassword(password);
  console.log('Password match result:', isMatch);
  if (isMatch) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      status: user.status,
      token: generateToken(user._id)
    });
  } else {
    console.error('Entered password:', password);
    console.error('Password match result:', isMatch);
    console.error('Login failed: invalid password for', email);
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
};
