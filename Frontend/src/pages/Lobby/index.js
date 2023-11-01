import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiEdit } from "react-icons/fi";
import ConfirmationModal from "../../components/others/ConfirmationModal";

import "./style.css";

function Lobby() {
  const [areas, setAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [areaIdToDelete, setAreaIdToDelete] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7239/api/area", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setAreas(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  async function handleDeleteArea(id) {
    try {
      const response = await fetch(`https://localhost:7239/api/area/${id}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        setAreas(areas.filter((area) => area.id !== id));
      } else if (response.status === 404) {
        alert("Área não encontrada.");
      } else {
        alert("Erro ao deletar Área, tente novamente.");
      }
    } catch (err) {
      alert("Erro ao deletar Área, tente novamente.");
    }
  }

  return (
    <>
      <div className="Background-layer">
        <div>
          <header className="Header">
            Organizer/
            <Link to="/" className="Register-button">
              Cadastrar Área
            </Link>
          </header>
        </div>
        Áreas Cadastradas
        <ul className="Card">
          {areas.map((area) => (
            <li key={area.id}>
              <div>
                <h3>{area.nome}</h3>
                <div>
                  <button
                    className="Delete-button"
                    onClick={() => handleDeleteArea(area.id)}
                    type="button"
                  >
                    <FiTrash2 size="25" />
                  </button>
                  <button
                    className="Edit-button"
                    /* onClick={() => handleUpdateArea(area.Id)} */ type="button"
                  >
                    <FiEdit size="25" />
                  </button>
                </div>
              </div>
              <p>{area.descricao}</p>
            </li>
          ))}
        </ul>
        <div className="Pagination">
          <a>1 2 3 4</a>
        </div>
      </div>
    </>
  );
}

export default Lobby;
