import React, { useState } from "react";
import "./addProcessosSubprocessosModal.css";
import { IoMdAddCircle } from "react-icons/io";

const AddProcessosSubprocessosModal = ({
  processos,
  onConfirm,
  onCancel,
  onSave,
}) => {
  const [selectedProcesso, setSelectedProcesso] = useState("");
  const [newProcesso, setNewProcesso] = useState("");
  const [newSubprocesso, setNewSubprocesso] = useState("");
  const [subprocessos, setSubprocessos] = useState([]);

  const handleAddSubprocesso = () => {
    if (newSubprocesso.trim() !== "") {
      setSubprocessos((prevSubprocessos) => [
        ...prevSubprocessos,
        newSubprocesso.trim(),
      ]);
      setNewSubprocesso("");
    }
  };

  const handleSave = () => {
    if ((selectedProcesso || newProcesso) && processos) {
      onSave(selectedProcesso || newProcesso, subprocessos);
    }
  };

  return (
    <div className="Modal-Overlay">
      <div className="Processos-Subprocessos-Modal">
        <div>
          <label className="Processos-Modal">
            Processos
            <div>escolha um processo existente ou crie um novo</div>
            <select
              value={selectedProcesso}
              onChange={(e) => setSelectedProcesso(e.target.value)}
            >
              <option value=""></option>
              {processos &&
                processos.map((processo) => (
                  <option key={processo} value={processo}>
                    {processo}
                  </option>
                ))}
            </select>
            {selectedProcesso === "" && (
              <input
                type="text"
                value={newProcesso}
                onChange={(e) => setNewProcesso(e.target.value)}
              />
            )}
          </label>

          <label className="Subprocessos-Modal">
            Subprocessos
            <div>adicione subprocessos caso queira</div>
            <input
              type="text"
              value={newSubprocesso}
              onChange={(e) => setNewSubprocesso(e.target.value)}
            />
            <button className="Add-button" onClick={handleAddSubprocesso}>
              <IoMdAddCircle size="40" color="rgb(83, 160, 231)" />
            </button>
          </label>

          {subprocessos.length > 0 && (
            <div>
              <ul>
                {subprocessos.map((subprocesso, index) => (
                  <li key={index}>{subprocesso}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <button className="Confirmar" onClick={handleSave}>
              Confirmar
            </button>
            <button className="Cancelar" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProcessosSubprocessosModal;
