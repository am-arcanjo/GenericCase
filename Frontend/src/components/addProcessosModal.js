import React, { useState } from "react";
import "./addProcessosModal.css";
import { IoMdAddCircle, IoMdSearch } from "react-icons/io";

const AddProcessosModal = ({ processos, onCancel, onSave }) => {
  const [newProcesso, setNewProcesso] = useState("");
  const [newSubprocesso, setNewSubprocesso] = useState("");
  const [subprocessos, setSubprocessos] = useState([]);

  const handleAddProcesso = () => {
    if ((selectedProcesso || newProcesso) && processos) {
      onSave(selectedProcesso || newProcesso, subprocessos);
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
