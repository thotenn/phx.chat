import React, { useState, useRef, useEffect } from 'react';

const ChatRoom = ({ room, messages, username, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll a los mensajes más recientes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-room">
      <div className="room-header">
        <h2>{room.name}</h2>
        {room.description && <p>{room.description}</p>}
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="no-messages">No hay mensajes aún. ¡Sé el primero en escribir!</p>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={msg.id || index} 
              className={`message ${msg.username === username ? 'own-message' : ''}`}
            >
              <div className="message-header">
                <span className="message-username">{msg.username}</span>
                {msg.inserted_at && (
                  <span className="message-time">{formatTime(msg.inserted_at)}</span>
                )}
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default ChatRoom;