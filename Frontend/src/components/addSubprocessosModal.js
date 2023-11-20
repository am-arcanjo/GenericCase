import React, { useState } from "react";
import "./addSubprocessosModal.css";
import { IoMdAddCircle } from "react-icons/io";

const AddSubprocessosModal = ({
  processos,
  onCancel,
  onSave,
  onFind,
  propSelectedProcesso,
  selectedProcessoId,
}) => {
  const [selectedProcesso, setSelectedProcesso] = useState("");
  const [newSubprocesso, setNewSubprocesso] = useState("");
  const [subprocessos, setSubprocessos] = useState([]);

  const handleAddSubprocesso = async () => {
    if (!selectedProcessoId || !newSubprocesso) {
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:7239/api/area/subprocessos/${selectedProcessoId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nome: newSubprocesso,
            ProcessosModelId: selectedProcessoId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao adicionar Subprocesso");
      }

      const createdSubprocesso = await response.json();

      console.log("Created Subprocesso:", createdSubprocesso);

      setSubprocessos((prevSubprocessos) => [
        ...prevSubprocessos,
        createdSubprocesso,
      ]);
      setNewSubprocesso("");
    } catch (error) {
      console.error("Erro ao adicionar Subprocesso:", error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleProcessoChange = (e) => {
    setSelectedProcesso(e.target.value);
  };

  return (
    <div className="Modal-Overlay">
      <div className="Processos-Subprocessos-Modal">
        <div>
          <label className="Processos-Modal">
            Processos
            <div>procure um processo existente</div>
            <select
              value={selectedProcesso}
              onChange={handleProcessoChange}
              className="Dropdown-Processos"
            >
              <option value="" disabled>
                Selecione um processo
              </option>
              {processos.map((processo) => (
                <option key={processo.id} value={processo.id}>
                  {processo.nome}
                </option>
              ))}
            </select>
          </label>
          <label className="Subprocessos-Modal">
            Subprocessos
            <div>adicione subprocessos</div>
            <input
              type="text"
              value={newSubprocesso}
              onChange={(e) => setNewSubprocesso(e.target.value)}
              className="Input-Subprocessos"
            />
            <button
              className="Add-button-subprocessos"
              onClick={handleAddSubprocesso}
              type="button"
            >
              <IoMdAddCircle size="30px" />
            </button>
          </label>

          {subprocessos.length > 0 && (
            <div>
              <ul>
                {subprocessos.map((subprocesso, index) => (
                  <li key={index}>{subprocesso.nome}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <button className="Confirmar" onClick={handleAddSubprocesso}>
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

export default AddSubprocessosModal;
