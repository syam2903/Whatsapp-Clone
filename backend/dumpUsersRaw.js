import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsappClone';

const dump = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'whatsappClone',
  });
  const users = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log('Raw users from MongoDB:');
  for (const user of users) {
    console.log(user);
  }
  mongoose.disconnect();
  process.exit();
};

dump();
