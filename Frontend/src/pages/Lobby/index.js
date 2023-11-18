import React, { useState, useEffect } from "react";
import { Link, useNavigate, navigate } from "react-router-dom";
import { FiTrash2, FiEdit } from "react-icons/fi";
import ConfirmationModal from "../../components/others";

import "./style.css";

function Lobby() {
  const [areas, setAreas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [areaIdToDelete, setAreaIdToDelete] = useState(null);
  const navigate = useNavigate();

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

  const handleDeleteArea = (id) => {
    setAreaIdToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `https://localhost:7239/api/area/${areaIdToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 204) {
        setAreas(areas.filter((area) => area.id !== areaIdToDelete));
      } else if (response.status === 404) {
        alert("Área não encontrada.");
      } else {
        alert("Erro ao deletar Área, tente novamente.");
      }
    } catch (err) {
      alert("Erro ao deletar Área, tente novamente.");
    }
    setShowModal(false);
    setAreaIdToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setAreaIdToDelete(null);
  };

  const handleAreaRedirect = (id) => {
    navigate(`/area/${id}`);
  };

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
                <h3 onClick={() => handleAreaRedirect(area.id)}>{area.nome}</h3>
                <div>
                  <button
                    className="Delete-button"
                    onClick={() => handleDeleteArea(area.id)}
                    type="button"
                  >
                    <FiTrash2 size="25" />
                  </button>
                  <button
                    className="Edit-button-lobby"
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
      {showModal && (
        <ConfirmationModal
          message="Você tem certeza que quer deletar essa área?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </>
  );
}

export default Lobby;
