import React, { useState } from "react";
import "./addProcessosSubprocessosModal.css";
import { IoMdAddCircle, IoMdSearch } from "react-icons/io";

const AddProcessosSubprocessosModal = ({
  processos,
  onCancel,
  onSave,
  onFind,
  selectedProcesso,
  selectedProcessoId,
}) => {
  const [selectedProcessos, setSelectedProcesso] = useState("");
  const [newProcesso, setNewProcesso] = useState("");
  const [newSubprocesso, setNewSubprocesso] = useState("");
  const [subprocessos, setSubprocessos] = useState([]);

  const handleAddSubprocesso = () => {
    setSubprocessos((prevSubprocessos) => [
      ...prevSubprocessos,
      newSubprocesso,
    ]);
    setNewSubprocesso("");
  };

  const handleAddProcesso = () => {
    if ((selectedProcesso || newProcesso) && processos) {
      onSave(selectedProcesso || newProcesso, subprocessos);
    }
  };

  const handleFindProcesso = () => {
    const foundProcesso = processos.find(
      (p) => p.nome === (selectedProcesso || newProcesso)
    );

    if (foundProcesso) {
      alert("Correspondência encontrada, processo selecionado");
      onFind(foundProcesso);
    } else {
      alert("Não foi possível encontrar esse processo nessa área");
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  console.log("Processos array:", processos);

  return (
    <div className="Modal-Overlay">
      <div className="Processos-Subprocessos-Modal">
        <div>
          <label className="Processos-Modal">
            Processos
            <div>procure um processo existente ou crie um novo</div>
            <input
              type="text"
              value={newProcesso}
              onChange={(e) => setNewProcesso(e.target.value)}
              className="Input-Processos"
            />
            <div>
              <button
                className="Find-button-processos"
                onClick={handleFindProcesso}
                type="button"
              >
                <IoMdSearch size="30px" />
              </button>
              <button
                className="Add-button-processos"
                onClick={handleAddProcesso}
                type="button"
              >
                <IoMdAddCircle size="30px" />
              </button>
            </div>
          </label>
          <div className="Processos-Subprocessos-Espaco"></div>
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
              <IoMdAddCircle size="30px" />
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

export default AddProcessosSubprocessosModal;
