import React, { useState } from "react";
import "./addAreaModal.css";

function AddAreaModal({ onSave, onCancel }) {
  const [areaName, setAreaName] = useState("");
  const [areaDescription, setAreaDescription] = useState("");

  const handleSave = () => {
    if (areaName.trim() !== "") {
      onSave(areaName, areaDescription);
      setAreaName("");
      setAreaDescription("");
    } else {
      alert("Por favor, insira o nome da área.");
    }
  };

  const handleCancel = () => {
    onCancel();
    setAreaName("");
    setAreaDescription("");
  };

  return (
    <div className="Modal-Overlay-AddArea">
      <div className="AddAreaModal">
        <label className="Add-Area-Name">Nome da Área</label>
        <input
          type="text"
          id="areaName"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
        />

        <label className="Add-Area-Description">Descrição</label>
        <input
          id="areaDescription"
          value={areaDescription}
          onChange={(e) => setAreaDescription(e.target.value)}
        />

        <div>
          <button onClick={handleSave} className="Confirmar-Area">
            Confirmar
          </button>
          <button onClick={handleCancel} className="Cancelar-Area">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddAreaModal;
