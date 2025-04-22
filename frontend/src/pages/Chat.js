import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
let socket;

function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [chatId, setChatId] = useState('6801074ef31ef9ff7de2cdb6'); // Pre-filled sample chat room
  const [participants, setParticipants] = useState([]);
  const [userMap, setUserMap] = useState({}); // Map userId to { name, email }
  const [rooms, setRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userInfo));
    socket = io(SOCKET_URL);
    // Fetch chat participants
    if (chatId) {
      fetch(`${API_URL}/chats/${chatId}`)
        .then(res => {
          if (!res.ok) throw new Error('Invalid chat room');
          return res.json();
        })
        .then(data => {
          if (data.participants) {
            setParticipants(data.participants);
            // Build userId -> user map for fast lookup
            const map = {};
            data.participants.forEach(u => { map[u._id] = u; });
            setUserMap(map);
          }
          setError('');
        })
        .catch(err => {
          setError(err.message);
          setParticipants([]);
          setUserMap({});
        });
      socket.emit('join_chat', chatId);
    }
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      if (socket) socket.disconnect();
    };
    // eslint-disable-next-line
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message || !chatId) return;
    const msgData = {
      chatId,
      sender: user._id,
      content: message,
      type: 'text',
    };
    if (!socket) {
      setError('Socket connection not established. Please refresh the page.');
      return;
    }
    socket.emit('send_message', msgData);
    setMessage('');
  };

  return (
    <div className="chat-container" style={{maxWidth: 500, margin: '40px auto', background: '#fff', borderRadius: 10, boxShadow: '0 2px 10px #0001', padding: 24}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2 style={{textAlign:'center', color:'#4caf50', margin:0}}>Chat Room</h2>
        <button onClick={()=>{localStorage.removeItem('userInfo'); window.location.reload();}} style={{background:'#e53935', color:'#fff', border:'none', borderRadius:6, padding:'4px 12px', marginLeft:12, cursor:'pointer', fontWeight:'bold'}}>Logout</button>
      </div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
        <input
          type="text"
          placeholder="Enter Chat ID to join"
          value={chatId}
          onChange={e => setChatId(e.target.value)}
          style={{width:'70%', padding:8, borderRadius:6, border:'1px solid #ccc'}}
        />
        <button type="button" style={{marginLeft:8, background:'#1976d2', color:'#fff', border:'none', borderRadius:6, padding:'8px 12px'}} onClick={async()=>{
          setShowRooms(r=>!r);
          if (!rooms.length) {
            const res = await fetch(`${API_URL}/chats/all`);
            const data = await res.json();
            setRooms(data);
          }
        }}>Show Rooms</button>
      </div>
      {showRooms && (
        <div style={{background:'#f0f4ff', borderRadius:6, padding:8, marginBottom:8}}>
          <strong>Available Rooms:</strong>
          {rooms.length === 0 && <div>No rooms found.</div>}
          {rooms.map(room => {
  let roomLabel = '';
  if (room.isGroup && room.groupName) {
    roomLabel = `Group: ${room.groupName}`;
  } else if (room.participants.length === 2 && user) {
    // Show the other participant's label
    const other = room.participants.find(p => p._id !== user._id);
    if (other && other.email === 'syamvishnu4@gmail.com') {
      roomLabel = 'chat1';
    } else {
      roomLabel = other ? other.name : 'Chat';
    }
  } else {
    roomLabel = 'Chat';
  }
  return (
    <div key={room._id} style={{margin:'8px 0', cursor:'pointer'}} onClick={()=>{setChatId(room._id); setShowRooms(false);}}>
      <span style={{fontWeight:'bold', color:'#1976d2'}}>{roomLabel}</span><br/>
      {room.participants.map(p => <span key={p._id} style={{marginLeft:8}}>{p.name} ({p.email})</span>)}
    </div>
  );
})}
        </div>
      )}
      {error && <div style={{color:'red', marginBottom:12, textAlign:'center'}}>{error}</div>}
      {/* Display participants */}
      <div className="participants" style={{marginBottom: 12, background:'#f9f9f9', borderRadius:6, padding:8}}>
        <strong>Participants:</strong>
        {participants.map(p => (
          <span key={p._id} style={{marginLeft: 8, color:'#1976d2'}}>
            {p.email}
          </span>
        ))}
      </div>
      <div className="messages" style={{height:320, overflowY:'auto', background:'#f5f5f5', borderRadius:6, padding:12, marginBottom:12, border:'1px solid #eee'}}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display:'flex', flexDirection:'column', alignItems: msg.sender === user._id ? 'flex-end' : 'flex-start',
            marginBottom: 10
          }}>
            <div style={{
              maxWidth: '80%',
              background: msg.sender === user._id ? '#e1ffc7' : '#fff',
              color: '#333',
              borderRadius: 8,
              padding: '6px 12px',
              boxShadow: '0 1px 3px #0001',
              border: msg.sender === user._id ? '1px solid #b2f2a5' : '1px solid #ddd'
            }}>
              <span style={{fontWeight:'bold', color:'#1976d2'}}>{userMap[msg.sender]?.email || msg.sender}:</span>
              <span style={{marginLeft:6}}>{msg.content}</span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{display:'flex', gap:8}}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          style={{flex:3, padding:10, borderRadius:6, border:'1px solid #ccc', fontSize: '1.1em'}}
        />
        <button type="submit" style={{background:'#4caf50', color:'#fff', border:'none', borderRadius:6, padding:'2px 6px', fontSize:'0.85em', minWidth:'36px', maxWidth:'48px', width:'48px'}}>Send</button>
      </form>
    </div>
  );
}

export default Chat;
