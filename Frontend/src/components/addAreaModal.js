import React, { useState } from "react";
import "./addAreaModal.css";

function AddAreaModal({ onSave, onCancel }) {
  const [areaName, setAreaName] = useState("");
  const [areaDescription, setAreaDescription] = useState("");
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);

  const handleSave = async () => {
    console.log("Saving area:", areaName, areaDescription);
    if (areaName.trim() !== "") {
      try {
        const response = await fetch("https://localhost:7239/api/area", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: areaName,
            descricao: areaDescription,
          }),
        });
        console.log("Response:", response);
        if (response.ok) {
          const newArea = await response.json();
          onSave(newArea.nome, newArea.descricao);
          setAreaName("");
          setAreaDescription("");
          setShowAddAreaModal(false);
        } else {
          alert("Erro ao adicionar a área. Por favor, tente novamente.");
        }
      } catch (error) {
        console.error("Error adding area:", error);
        alert("Erro ao adicionar a área. Por favor, tente novamente.");
      }
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
