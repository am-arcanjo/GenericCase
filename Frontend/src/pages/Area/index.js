import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate, navigate } from "react-router-dom";
import AddProcessosSubprocessosModal from "../../components/addProcessosSubprocessosModal";
import "./style.css";

function Area() {
  const { id } = useParams();
  const [area, setArea] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [editedNome, setEditedNome] = useState("");
  const [editedDescricao, setEditedDescricao] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newProcesso, setNewProcesso] = useState("");
  const [newSubprocesso, setNewSubprocesso] = useState("");
  const [selectedProcesso, setSelectedProcesso] = useState("");
  const [processos, setProcessos] = useState([]);

  const handleNomeChange = (event) => {
    setEditedNome(event.target.value);
    setArea((prevArea) => ({ ...prevArea, nome: event.target.value }));
  };

  const handleDescricaoChange = (event) => {
    setEditedDescricao(event.target.value);
    setArea((prevArea) => ({ ...prevArea, descricao: event.target.value }));
  };

  const handleProcessoChange = (event, processo) => {
    const updatedProcessos = area.processos.map((p) =>
      p === processo ? { ...p, nome: event.target.value } : p
    );
    setArea((prevArea) => ({ ...prevArea, processos: updatedProcessos }));
  };

  const handleSubprocessoChange = (event, subprocesso) => {
    const updatedProcessos = area.processos.map((processo) =>
      processo === subprocesso.processo
        ? {
            ...processo,
            subprocessos: processo.subprocessos.map((s) =>
              s === subprocesso ? { ...s, nome: event.target.value } : s
            ),
          }
        : processo
    );
    setArea((prevArea) => ({ ...prevArea, processos: updatedProcessos }));
  };

  const handleAddProcesso = () => {
    setNewProcesso("");
    setNewSubprocesso("");
    setSelectedProcesso("");
    setShowModal(true);
  };

  const handleSaveModal = async (newProcesso, subprocessos) => {
    try {
      const response = await fetch(
        `https://localhost:7239/api/area/processos/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome: newProcesso,
            subprocessos: subprocessos,
            areaModelId: id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao adicionar Processo");
      }

      const createdProcesso = await response.json();

      const updatedProcessos = [
        ...area.processos,
        { ...createdProcesso, subprocessos },
      ];

      setArea((prevArea) => ({ ...prevArea, processos: updatedProcessos }));
      setProcessos((prevProcessos) => [...prevProcessos, createdProcesso]);

      setNewProcesso("");
      setNewSubprocesso("");
      setSelectedProcesso("");
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao adicionar Processo:", error);
    }
  };

  const handleCloseModal = () => {
    setNewProcesso("");
    setNewSubprocesso("");
    setSelectedProcesso("");
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
          processos: area.processos,
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
          area.processos.map((processo) => (
            <li key={processo.nome} className="Processos-item">
              {isEditing ? (
                <input
                  type="text"
                  value={processo.nome}
                  onChange={(event) => handleProcessoChange(event, processo)}
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
                  {processo.subprocessos.map((subprocesso) => (
                    <li key={subprocesso.nome}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={subprocesso.nome}
                          onChange={(event) =>
                            handleSubprocessoChange(event, subprocesso)
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
                <button className="Add-subprocesso" onClick={handleAddProcesso}>
                  Adicionar Subprocesso
                </button>
              </div>
            </div>
          )}
        </div>
        {showModal && (
          <AddProcessosSubprocessosModal
            processos={area.processos}
            onSave={handleSaveModal}
            onCancel={handleCloseModal}
          />
        )}
      </div>
    </>
  );
}

export default Area;
