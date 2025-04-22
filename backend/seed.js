import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/userModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone';

const seedUser = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'whatsapp-clone',
    });

    const email = 'testuser@example.com';
    const password = 'Password123';
    const name = 'Test User';
    const profilePic = '';

    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        name,
        email,
        password: hashedPassword,
        profilePic,
      });
      await user.save();
      console.log('Test user created:', email, password);
    } else {
      console.log('Test user already exists:', email);
    }
    mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedUser();
