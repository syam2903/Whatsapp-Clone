import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import Message from './models/messageModel.js';
import Chat from './models/chatModel.js';
import User from './models/userModel.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/whatsapp-clone', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create HTTP server
const server = createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_chat', (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat: ${chatId}`);
    });

    socket.on('send_message', async (messageData) => {
        // Validate chatId before saving
        if (!mongoose.Types.ObjectId.isValid(messageData.chatId)) {
            socket.emit('error', { message: 'Invalid chatId format' });
            return;
        }
        const newMessage = new Message(messageData);
        await newMessage.save();
        io.to(messageData.chatId).emit('receive_message', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
