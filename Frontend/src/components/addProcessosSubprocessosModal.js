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

  console.log("Processos array:", processos);

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
              className={`Dropdown-Processos${
                selectedProcesso === "" ? " placeholder" : ""
              }`}
            >
              <option value="">selecione um processo</option>
              {processos &&
                processos.map((processo) => (
                  <option key={processo.nome} value={processo.nome}>
                    {processo.nome}
                  </option>
                ))}
            </select>
            {selectedProcesso === "" && (
              <input
                type="text"
                value={newProcesso}
                onChange={(e) => setNewProcesso(e.target.value)}
                className="Input-Processos"
              />
            )}
            <button
              className="Add-button-processos"
              onClick={handleAddSubprocesso}
              type="button"
            >
              <IoMdAddCircle size="40" />
            </button>
          </label>

          <label className="Subprocessos-Modal">
            Subprocessos
            <div>adicione subprocessos caso queira</div>
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
              <IoMdAddCircle size="40" />
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
