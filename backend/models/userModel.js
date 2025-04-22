import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        default: 'Hey there! I am using WhatsApp'
    },
    password: {
        type: String,
        required: true
        // select: false // temporarily removed for debugging
    }
}, { timestamps: true });

import bcrypt from 'bcryptjs';

userSchema.pre('save', async function (next) {
    console.log('[pre-save] Before hashing, password:', this.password);
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('[pre-save] After hashing, password:', this.password);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
