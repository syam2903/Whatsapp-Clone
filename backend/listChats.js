import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Chat from './models/chatModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone';

const listChats = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'whatsapp-clone',
    });
    const chats = await Chat.find({});
    console.log('Chats in DB:', chats);
    mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error('Error listing chats:', err);
    process.exit(1);
  }
};

listChats();
