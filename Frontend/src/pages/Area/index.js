import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link, useNavigate, navigate } from "react-router-dom";
import "./style.css";

function Area() {
  const { id } = useParams();
  const [area, setArea] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [editedNome, setEditedNome] = useState("");
  const [editedDescricao, setEditedDescricao] = useState("");

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
    const updatedProcessos = area.processos.map((processo) => ({
      ...processo,
      subprocessos: processo.subprocessos.map((s) =>
        s === subprocesso ? { ...s, nome: event.target.value } : s
      ),
    }));
    setArea((prevArea) => ({ ...prevArea, processos: updatedProcessos }));
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

        // Set initial values for editedNome and editedDescricao
        setEditedNome(data.nome);
        setEditedDescricao(data.descricao);
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
        <div className="Edit-buttons">
          {isEditing && (
            <div className="Edit-buttons">
              <button className="Save-button" onClick={handleSave}>
                Salvar
              </button>
              <button className="Close-button" onClick={handleClose}>
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Area;
