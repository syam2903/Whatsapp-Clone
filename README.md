# WhatsApp Clone (MERN Stack)

## Purpose
This application is a real-time chat platform inspired by WhatsApp, built using the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.io. It supports user registration, authentication, and real-time messaging in both group and private chat rooms. Users can see participants, send messages instantly, and enjoy a modern, user-friendly interface.

---

## Features
- **User Registration & Login** (JWT-secured)
- **Real-time Messaging** (Socket.io)
- **Group & Private Chats**
- **User List & Room List**
- **Modern Responsive UI**
- **Password Hashing & Secure Auth**

---

## Getting Started

### 1. Clone the Repository
```
git clone <your-repo-url>
cd whatsapp-clone
```

### 2. Install Dependencies
#### Backend
```
cd backend
npm install
```
#### Frontend
```
cd ../frontend
npm install
```

### 3. Setup Environment Variables
#### Backend (`backend/.env`)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/whatsappClone
JWT_SECRET=your_jwt_secret
```
#### Frontend (`frontend/.env`)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Seed the Database (Users & Room)
In `backend` directory, run:
```
node resetUsers.js   # Seeds 3 users: chat1, testuser, admin (all passwords: 12345678)
node seedRoom.js     # Seeds a group chat room with all 3 users
```

### 5. Run the Application
#### Start Backend
```
cd backend
npm start
```
#### Start Frontend
```
cd ../frontend
npm start
```

### 6. Access the App
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Login with one of the seeded accounts:
  - **Email:** syamvishnu4@gmail.com | **Password:** 12345678
  - **Email:** testuser@example.com  | **Password:** 12345678
  - **Email:** admin@gmail.com       | **Password:** 12345678

---

## Notes
- Make sure MongoDB is running locally on your machine.
- You can register new users from the UI as well.
- For more rooms or features, modify the seed scripts or UI as needed.

---

## License
MIT
