import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone';

const resetUsers = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'whatsappClone',
    });
    // Remove all users
    await User.deleteMany({});
    // Add both users with password '12345678'
    const users = [
      { name: 'chat1', email: 'syamvishnu4@gmail.com', password: '12345678' },
      { name: 'Test User', email: 'testuser@example.com', password: '12345678' },
      { name: 'admin', email: 'admin@gmail.com', password: '12345678' }
    ];
    for (const user of users) {
      console.log('About to save user:', user);
      const u = new User(user);
      await u.save();
      const fetched = await User.findOne({ email: user.email }).select('+password');
      console.log('Fetched after save:', fetched.toObject());
    }
    console.log('Users reset and added with password 12345678');
    mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error('Error resetting users:', err);
    process.exit(1);
  }
};

resetUsers();
