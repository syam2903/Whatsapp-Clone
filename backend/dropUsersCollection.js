import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsappClone';

const dropUsers = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'whatsappClone',
  });
  try {
    await mongoose.connection.db.dropCollection('users');
    console.log('Dropped users collection.');
  } catch (e) {
    console.log('users collection did not exist or could not be dropped.');
  }
  mongoose.disconnect();
  process.exit();
};

dropUsers();
