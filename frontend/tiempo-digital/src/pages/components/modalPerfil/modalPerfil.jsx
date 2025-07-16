import React, { useState } from "react";
import "./styles.css";
import useGetPerfiles from "../../../hooks/useGetPerfiles";

const CompleteProfileModal = ({ onClose, onSubmit }) => {
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [description, setDescription] = useState("");
  const perfiles = useGetPerfiles(); 

  const handleCheckboxChange = (perfil) => {
    if (selectedProfiles.includes(perfil.external_id)) {
      setSelectedProfiles(selectedProfiles.filter((id) => id !== perfil.external_id));
    } else {
      setSelectedProfiles([...selectedProfiles, perfil.external_id]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ tipo_perfil: selectedProfiles, descripcion: description });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h1>Crear Perfil</h1>
        <form onSubmit={handleSubmit}>
          <p>¿Cuáles son tus habilidades u ocupaciones?</p>
          <div className="checkbox-group">
            {perfiles.map((perfil) => (
              <label key={perfil.external_id}>
                <input
                  type="checkbox"
                  value={perfil.external_id}
                  checked={selectedProfiles.includes(perfil.external_id)}
                  onChange={() => handleCheckboxChange(perfil)}
                />
                {perfil.nombre.charAt(0).toUpperCase() + perfil.nombre.slice(1)}
              </label>
            ))}
          </div>
          <p id="descriptionp">Danos alguna descripción breve de ti:</p>
          <textarea
            className="txt-area"
            placeholder="Añade una descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="buttons">
            <button type="submit" className="btn">Guardar</button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
