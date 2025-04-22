import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Chat from './models/chatModel.js';
import User from './models/userModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone';

const listRooms = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'whatsapp-clone',
    });
    const chats = await Chat.find({}).populate('participants', 'name email');
    console.log('Rooms in DB:');
    chats.forEach(chat => {
      console.log(`Room ID: ${chat._id}`);
      chat.participants.forEach(p => console.log(`  - ${p.name} (${p.email})`));
    });
    mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error('Error listing rooms:', err);
    process.exit(1);
  }
};

listRooms();
