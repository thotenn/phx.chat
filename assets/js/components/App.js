import React, { useState, useEffect } from 'react';
import { Socket } from 'phoenix';
import RoomList from './RoomList';
import ChatRoom from './ChatRoom';
import CreateRoomForm from './CreateRoomForm';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [channel, setChannel] = useState(null);
  const [username, setUsername] = useState('');
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generar nombre de usuario aleatorio al cargar la página
  useEffect(() => {
    const adjectives = ['Happy', 'Quick', 'Clever', 'Brave', 'Wise', 'Gentle', 'Bold', 'Calm', 'Eager', 'Fair'];
    const nouns = ['Fox', 'Bear', 'Eagle', 'Wolf', 'Lion', 'Tiger', 'Shark', 'Hawk', 'Deer', 'Owl'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);
    
    setUsername(`${randomAdjective}${randomNoun}${randomNumber}`);
  }, []);

  // Inicializar conexión de socket
  useEffect(() => {
    if (username) {
      const newSocket = new Socket('/socket', {});
      newSocket.connect();
      setSocket(newSocket);
    }
  }, [username]);

  // Unirse al canal lobby y obtener salas disponibles
  useEffect(() => {
    if (socket) {
      const lobbyChannel = socket.channel('room:lobby', {});
      
      lobbyChannel.join()
        .receive('ok', () => {
          console.log('Conectado al lobby');
          setChannel(lobbyChannel);
          
          // Obtener las salas disponibles
          lobbyChannel.push('get_rooms', {})
            .receive('ok', response => {
              setRooms(response.rooms || []);
              setLoading(false);
            })
            .receive('error', error => {
              console.error('Error al obtener salas:', error);
              setLoading(false);
            });
        })
        .receive('error', error => {
          console.error('Error al conectar al lobby:', error);
          setLoading(false);
        });
        
      // Escuchar la creación de nuevas salas
      lobbyChannel.on('room_created', room => {
        setRooms(prevRooms => [...prevRooms, room]);
      });
      
      return () => {
        lobbyChannel.leave();
      };
    }
  }, [socket]);

  // Función para unirse a una sala
  const joinRoom = (roomId) => {
    if (socket && channel) {
      // Dejar la sala actual si existe
      if (currentRoom) {
        socket.channel(`room:${currentRoom.id}`).leave();
      }
      
      // Unirse a la nueva sala
      const roomChannel = socket.channel(`room:${roomId}`, {});
      
      roomChannel.join()
        .receive('ok', response => {
          console.log('Unido a la sala:', response.room);
          setCurrentRoom(response.room);
          setMessages(response.messages || []);
          
          // Escuchar nuevos mensajes
          roomChannel.on('new_message', message => {
            setMessages(prevMessages => [...prevMessages, message]);
          });
        })
        .receive('error', error => {
          console.error('Error al unirse a la sala:', error);
        });
        
      setChannel(roomChannel);
    }
  };

  // Función para crear una nueva sala
  const createRoom = (name, description) => {
    if (channel) {
      channel.push('create_room', { name, description })
        .receive('ok', response => {
          console.log('Sala creada con ID:', response.room_id);
          
          // Opcional: unirse a la sala recién creada
          joinRoom(response.room_id);
        })
        .receive('error', error => {
          console.error('Error al crear sala:', error);
        });
    }
  };

  // Función para enviar un mensaje
  const sendMessage = (content) => {
    if (channel && currentRoom) {
      channel.push('new_message', { content, username })
        .receive('error', error => {
          console.error('Error al enviar mensaje:', error);
        });
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="chat-app">
      <header>
        <h1>Phoenix Chat</h1>
        <div className="user-info">
          Tu usuario: <span className="username">{username}</span>
        </div>
      </header>
      
      <div className="app-container">
        <aside className="sidebar">
          <CreateRoomForm onSubmit={createRoom} />
          <RoomList 
            rooms={rooms} 
            currentRoomId={currentRoom?.id} 
            onRoomSelect={joinRoom} 
          />
        </aside>
        
        <main className="chat-content">
          {currentRoom ? (
            <ChatRoom 
              room={currentRoom}
              messages={messages}
              username={username}
              onSendMessage={sendMessage}
            />
          ) : (
            <div className="select-room-message">
              <h2>Bienvenido a Phoenix Chat</h2>
              <p>Selecciona una sala o crea una nueva para comenzar a chatear</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;