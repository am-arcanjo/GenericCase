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
  const [editedProcessos, setEditedProcessos] = useState(
    (area?.processos || []).map((processo) => processo.nome)
  );

  const [editedSubprocessos, setEditedSubprocessos] = useState([]);
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

  const handleSubprocessosChange = (event, processoIndex, subprocessoIndex) => {
    const updatedSubprocessos = [...editedSubprocessos];
    updatedSubprocessos[processoIndex][subprocessoIndex].nome =
      event.target.value;
    setEditedSubprocessos(updatedSubprocessos);
  };

  const handleAddProcesso = () => {
    setNewProcesso("");
    setNewSubprocesso("");
    setSelectedProcesso("");
    setSelectedProcessoId(null);
    setAddingProcesso(true);
    setShowModal(true);
  };

  const handleAddSubprocesso = (selectedProcessoId) => {
    setNewSubprocesso("");
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
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao adicionar Processo:", error);
    }
  };

  const handleSaveSubprocessos = async (subprocessos) => {
    try {
      const subprocessoResponses = await Promise.all(
        subprocessos.map((subprocesso, index) =>
          fetch(
            `https://localhost:7239/api/area/subprocessos/${selectedProcesso}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                Nome: subprocesso,
                ProcessosModelId: selectedProcesso,
              }),
            }
          )
        )
      );

      const createdSubprocessos = await Promise.all(
        subprocessoResponses.map((response) => response.json())
      );

      console.log("Created Subprocessos:", createdSubprocessos);

      handleSubprocessosChange(createdSubprocessos);

      const updatedProcessos = area.processos.map((processo, index) =>
        processo.id === selectedProcessoId
          ? { ...processo, subprocessos: createdSubprocessos }
          : processo
      );

      setArea((prevArea) => ({ ...prevArea, processos: updatedProcessos }));

      setNewSubprocesso("");
      setSelectedProcesso("");
      setShowModal(false);
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
        console.log("AAAAAS", data);
        const processos = data.processos || [];

        setArea(data);
        setEditedNome(data.nome);
        setEditedDescricao(data.descricao);
        setArea((prevArea) => ({
          ...prevArea,
          processos: data.processos || [],
        }));
        setProcessos(data.processos || []);
        setEditedSubprocessos(
          processos.map((processo) => processo.subprocessos ?? [])
        );
        setEditedProcessos(data?.processos || []);
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
          area.processos.map((processo, processoIndex) => (
            <li key={processo.nome} className="Processos-item">
              {isEditing ? (
                <input
                  type="text"
                  value={editedProcessos[processoIndex].nome}
                  onChange={(event) =>
                    handleProcessosChange(event, processoIndex)
                  }
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
                  {isEditing
                    ? editedSubprocessos[processoIndex].map(
                        (subprocesso, subprocessoIndex) => (
                          <li key={subprocesso.nome}>
                            <input
                              type="text"
                              value={subprocesso.nome}
                              onChange={(event) => {
                                handleSubprocessosChange(
                                  event,
                                  processoIndex,
                                  subprocessoIndex
                                );
                              }}
                            />
                          </li>
                        )
                      )
                    : processo.subprocessos.map((subprocesso) => (
                        <li key={subprocesso.nome}>{subprocesso.nome}</li>
                      ))}
                </ul>
              )}
            </li>
          ))}
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
            <div className="Add-buttons">
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
        {showModal && addingProcesso ? (
          <AddProcessosModal
            areaId={id}
            onCancel={handleCloseModal}
            onSave={handleSaveProcesso}
          />
        ) : showModal && !addingProcesso ? (
          <AddSubprocessosModal
            processos={area.processos}
            onSave={handleSaveSubprocessos}
            onCancel={handleCloseModal}
          />
        ) : null}
      </div>
    </>
  );
}

export default Area;
