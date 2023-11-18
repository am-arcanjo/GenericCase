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
    setEditedNome(event.target.innerText);
  };

  const handleDescricaoChange = (event) => {
    setEditedDescricao(event.target.innerText);
  };

  const handleSave = async () => {
    try {
      // Make a PUT request to update the area on the server
      const response = await fetch(`https://localhost:7239/api/area/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: editedNome,
          descricao: editedDescricao,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar Área no Servidor");
      }
      setArea({
        ...area,
        nome: editedNome,
        descricao: editedDescricao,
      });

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
        <div
          className="Area-nome"
          contentEditable={isEditing}
          onInput={handleNomeChange}
        >
          {area.nome}{" "}
          {!isEditing && (
            <button
              className="Edit-button"
              onClick={() => setEditing(!isEditing)}
            >
              Editar
            </button>
          )}
        </div>
        <p
          className="Area-descricao"
          contentEditable={isEditing}
          onInput={handleDescricaoChange}
        >
          {area.descricao}
        </p>

        <ul className="Processsos-list">
          {area.processos &&
            area.processos.map((processo) => (
              <li key={processo.nome} className="Processos-item">
                {processo.nome}
                {processo.subprocessos && processo.subprocessos.length > 0 && (
                  <ul className="Subprocessos-list">
                    {processo.subprocessos.map((subprocesso) => (
                      <li key={subprocesso.nome}>{subprocesso.nome}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
        </ul>
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
