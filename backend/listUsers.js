import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone';

const listUsers = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'whatsapp-clone',
    });
    const users = await User.find({});
    console.log('Users in DB:', users);
    mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error('Error listing users:', err);
    process.exit(1);
  }
};

listUsers();
