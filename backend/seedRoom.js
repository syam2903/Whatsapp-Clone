import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Chat from './models/chatModel.js';
import User from './models/userModel.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone';

const seedRoom = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'whatsappClone',
    });

    // Remove all chats
    await Chat.deleteMany({});

    // Find all users to add to the room
    const users = await User.find();
    if (users.length < 3) {
      console.error('Not enough users to create a group chat. Please register at least 3 users.');
      process.exit(1);
    }

    // Create a group chat room with all users
    const chat = new Chat({
      participants: users.map(u => u._id),
      isGroup: true,
      groupName: 'All Users'
    });
    await chat.save();
    console.log('Sample group chat room created with ID:', chat._id.toString());
    console.log('Participants:', users.map(u => u.email));
    mongoose.disconnect();
    process.exit();
  } catch (err) {
    console.error('Seeding chat room error:', err);
    process.exit(1);
  }
};

seedRoom();
