import React, { useState } from "react";
import "./addProcessosModal.css";
import { IoMdAddCircle } from "react-icons/io";

const AddProcessosModal = ({ areaId, onCancel, onSave }) => {
  const [newProcesso, setNewProcesso] = useState("");

  const handleAddProcesso = async () => {
    if (!newProcesso) {
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7239/api/area/processos/${areaId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nome: newProcesso,
            AreaModelId: areaId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao adicionar Processo");
      }

      const createdProcesso = await response.json();

      onSave(createdProcesso);

      setNewProcesso("");
    } catch (error) {
      console.error("Erro ao adicionar Processo:", error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="Modal-Overlay">
      <div className="Processos-Subprocessos-Modal">
        <div>
          <label className="Processos-Modal">
            Processos
            <div>crie um novo processo</div>
            <input
              type="text"
              value={newProcesso}
              onChange={(e) => setNewProcesso(e.target.value)}
              className="Input-Processos"
            />
            <div>
              <button
                className="Add-button-processos"
                onClick={handleAddProcesso}
                type="button"
              >
                <IoMdAddCircle size="30px" />
              </button>
            </div>
          </label>
          <div>
            <button className="Confirmar" onClick={handleAddProcesso}>
              Confirmar
            </button>
            <button className="Cancelar" onClick={handleCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProcessosModal;
