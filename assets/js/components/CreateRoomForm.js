import React, { useState } from 'react';

const CreateRoomForm = ({ onSubmit }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '') return;
    
    onSubmit(name, description);
    setName('');
    setDescription('');
    setIsFormVisible(false);
  };

  return (
    <div className="create-room">
      {!isFormVisible ? (
        <button 
          className="show-form-button"
          onClick={() => setIsFormVisible(true)}
        >
          Crear Nueva Sala
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="room-name">Nombre</label>
            <input
              id="room-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre de la sala"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="room-description">Descripción (opcional)</label>
            <input
              id="room-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción de la sala"
            />
          </div>
          
          <div className="form-actions">
            <button type="submit">Crear</button>
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => setIsFormVisible(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateRoomForm;