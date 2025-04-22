import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsappClone';

const debug = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'whatsappClone',
  });
  const users = await User.find();
  for (const user of users) {
    console.log(`User: ${user.email}\n  Hashed Password: ${user.password}`);
    const match = await bcrypt.compare('12345678', user.password);
    console.log(`  Matches '12345678': ${match}`);
  }
  mongoose.disconnect();
  process.exit();
};

debug();
