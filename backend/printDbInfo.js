import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsappClone';

const printDbInfo = async () => {
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'whatsappClone',
  });
  const db = mongoose.connection.db;
  const dbName = db.databaseName;
  const collections = await db.listCollections().toArray();
  console.log('Connected to DB:', dbName);
  console.log('Collections:');
  collections.forEach(c => console.log(' -', c.name));
  mongoose.disconnect();
  process.exit();
};

printDbInfo();
