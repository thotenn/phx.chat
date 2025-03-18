import React from 'react';

const RoomList = ({ rooms, currentRoomId, onRoomSelect }) => {
  return (
    <div className="room-list">
      <h2>Salas de Chat</h2>
      {rooms.length === 0 ? (
        <p className="no-rooms">No hay salas disponibles</p>
      ) : (
        <ul>
          {rooms.map(room => (
            <li 
              key={room.id} 
              className={currentRoomId === room.id ? 'active' : ''}
              onClick={() => onRoomSelect(room.id)}
            >
              <div className="room-name">{room.name}</div>
              {room.description && (
                <div className="room-description">{room.description}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomList;