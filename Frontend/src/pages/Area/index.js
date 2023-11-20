import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate, navigate } from "react-router-dom";
import AddProcessosModal from "../../components/addProcessosModal";
import AddSubprocessosModal from "../../components/addSubprocessosModal";
import "./style.css";

function Area() {
  const { id } = useParams();
  const [area, setArea] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [editedNome, setEditedNome] = useState("");
  const [editedDescricao, setEditedDescricao] = useState("");
  const [editedProcessos, setEditedProcessos] = useState("");
  const [editedSubprocessos, setEditedSubprocessos] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [addingProcesso, setAddingProcesso] = useState(null);
  const [newProcesso, setNewProcesso] = useState("");
  const [newSubprocesso, setNewSubprocesso] = useState("");
  const [selectedProcesso, setSelectedProcesso] = useState("");
  const [selectedProcessoId, setSelectedProcessoId] = useState(null);
  const [subprocessos, setSubprocessos] = useState([]);
  const [processos, setProcessos] = useState("");

  const handleNomeChange = (event) => {
    setEditedNome(event.target.value);
    setArea((prevArea) => ({ ...prevArea, nome: event.target.value }));
  };

  const handleDescricaoChange = (event) => {
    setEditedDescricao(event.target.value);
    setArea((prevArea) => ({ ...prevArea, descricao: event.target.value }));
  };

  const handleProcessosChange = (event, index) => {
    const updatedProcessos = [...editedProcessos];
    updatedProcessos[index] = event.target.value;
    setEditedProcessos(updatedProcessos);
  };

  const handleUpdateSubprocessos = (createdSubprocessos) => {
    setArea((prevArea) => {
      const updatedProcessos = prevArea.processos.map((processo) => {
        if (processo.id === selectedProcessoId) {
          return {
            ...processo,
            subprocessos: [...processo.subprocessos, ...createdSubprocessos],
          };
        }
        return processo;
      });

      return { ...prevArea, processos: updatedProcessos };
    });
    handleCloseModal();
  };

  const handleAddProcesso = () => {
    setNewProcesso("");
    setNewSubprocesso("");
    setSelectedProcesso("");
    setSelectedProcessoId(null);
    setAddingProcesso(true);
    setShowModal(true);
  };

  const handleAddSubprocesso = (selectedProcesso) => {
    setNewSubprocesso("");
    setSelectedProcesso(selectedProcesso);
    setSelectedProcessoId(selectedProcessoId);
    setAddingProcesso(false);
    setShowModal(true);
  };

  const handleSaveProcesso = async (newProcesso) => {
    try {
      const processoResponse = await fetch(
        `https://localhost:7239/api/area/processos/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Nome: newProcesso,
            AreaModelId: id,
          }),
        }
      );

      if (!processoResponse.ok) {
        throw new Error("Erro ao adicionar Processo");
      }

      const createdProcesso = await processoResponse.json();

      console.log("Created Processo:", createdProcesso);

      const updatedProcessos = [
        ...area.processos,
        { ...createdProcesso, subprocessos: [] },
      ];

      setArea((prevArea) => ({ ...prevArea, processos: updatedProcessos }));
      setProcessos((prevProcessos) => [...prevProcessos, createdProcesso]);

      setNewProcesso("");
      setAddingProcesso(false);
    } catch (error) {
      console.error("Erro ao adicionar Processo:", error);
    }
  };

  const handleSaveSubprocessos = async (subprocessos) => {
    try {
      const subprocessoResponses = await Promise.all(
        subprocessos.map((subprocesso, index) =>
          fetch(
            `https://localhost:7239/api/area/subprocessos/${selectedProcessoId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                Nome: subprocesso,
                ProcessosModelId: selectedProcessoId,
              }),
            }
          )
        )
      );

      const createdSubprocessos = await Promise.all(
        subprocessoResponses.map((response) => response.json())
      );

      console.log("Created Subprocessos:", createdSubprocessos);

      handleUpdateSubprocessos(createdSubprocessos);

      const updatedProcessos = area.processos.map((processo, index) =>
        processo.id === selectedProcessoId
          ? { ...processo, subprocessos: createdSubprocessos }
          : processo
      );

      setArea((prevArea) => ({ ...prevArea, processos: updatedProcessos }));

      setNewSubprocesso("");
      setSelectedProcesso("");
    } catch (error) {
      console.error("Erro ao adicionar Subprocessos:", error);
    }
  };

  const handleCloseModal = () => {
    setNewProcesso("");
    setNewSubprocesso("");
    setSelectedProcesso("");
    setAddingProcesso(false);
    setShowModal(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://localhost:7239/api/area/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: area.id,
          nome: editedNome,
          descricao: editedDescricao,
          processos: editedProcessos.map((processo, index) => ({
            ...processo,
            subprocessos: editedSubprocessos[index],
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar Área no Servidor");
      }

      setEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar Área:", error);
    }
  };

  const handleClose = () => {
    setEditing(false);
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const isEditing = url.searchParams.get("edit") === "true";
    setEditing(isEditing);

    fetch(`https://localhost:7239/api/area/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setArea(data);
        setEditedNome(data.nome);
        setEditedDescricao(data.descricao);
        setArea((prevArea) => ({
          ...prevArea,
          processos: data.processos || [],
        }));
        setProcessos(data.processos || []);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [id]);

  if (!area) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <div className="Processos">
        <div className="Area-nome">
          {isEditing ? (
            <input type="text" value={editedNome} onChange={handleNomeChange} />
          ) : (
            <>
              {area.nome}{" "}
              <button
                className="Edit-button"
                onClick={() => setEditing(!isEditing)}
              >
                Editar
              </button>
            </>
          )}
        </div>
        <p className="Area-descricao">
          {isEditing ? (
            <textarea
              value={editedDescricao}
              onChange={handleDescricaoChange}
            />
          ) : (
            area.descricao
          )}
        </p>
        {area.processos &&
          area.processos.map((processo, index) => (
            <li key={processo.nome} className="Processos-item">
              {isEditing ? (
                <input
                  type="text"
                  value={editedProcessos[index]}
                  onChange={(event) => handleProcessosChange(event, index)}
                />
              ) : (
                <>
                  {processo.nome}{" "}
                  {isEditing && (
                    <button
                      className="Edit-button"
                      onClick={() => setEditing(!isEditing)}
                    >
                      Editar
                    </button>
                  )}
                </>
              )}
              {processo.subprocessos && processo.subprocessos.length > 0 && (
                <ul className="Subprocessos-list">
                  {processo.subprocessos.map((subprocesso, index) => (
                    <li key={subprocesso.nome}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedSubprocessos[index]}
                          onChange={(event) =>
                            handleUpdateSubprocessos(event, index)
                          }
                        />
                      ) : (
                        subprocesso.nome
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        <div>
          {isEditing && (
            <div>
              <div className="Edit-buttons">
                <button className="Save-button" onClick={handleSave}>
                  Salvar
                </button>
                <button className="Close-button" onClick={handleClose}>
                  Fechar
                </button>
              </div>
              <div>
                <button className="Add-processo" onClick={handleAddProcesso}>
                  Adicionar Processo
                </button>
                <button
                  className="Add-subprocesso"
                  onClick={() => handleAddSubprocesso(processos)}
                >
                  Adicionar Subprocesso
                </button>
              </div>
            </div>
          )}
        </div>
        {showModal && addingProcesso ? (
          <AddProcessosModal
            processos={area.processos}
            onSave={handleSaveProcesso}
            onCancel={handleCloseModal}
            selectedProcesso={selectedProcesso}
            selectedProcessoId={selectedProcessoId}
          />
        ) : showModal && !addingProcesso ? (
          <AddSubprocessosModal
            processos={area.processos}
            onSave={handleSaveSubprocessos}
            onCancel={handleCloseModal}
            selectedProcesso={selectedProcesso}
            selectedProcessoId={selectedProcessoId}
          />
        ) : null}
      </div>
    </>
  );
}

export default Area;
