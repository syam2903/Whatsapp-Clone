import express from 'express';
const router = express.Router();
import Chat from '../models/chatModel.js';
import User from '../models/userModel.js';

// Get all chats (for room listing)
router.get('/all', async (req, res) => {
  try {
    const chats = await Chat.find({}).populate('participants', 'name email');
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chat by ID
router.get('/:id', async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id).populate('participants', 'name email');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
