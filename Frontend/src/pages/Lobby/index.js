import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiEdit } from "react-icons/fi";

import "./style.css";

function Lobby() {
  // async function handleDeleteArea(id) {
  //   try {
  //       await api.delete(`area/${id}`, {
  //       });

  //       setArea(area.filter(area => area.id !== id));

  //   } catch (err) {
  //       alert('Erro ao deletar Área, tente novamente.');
  //   }
  // }

  // const [areas, setAreas] = useState([]);

  // const navigate = useNavigate();

  // const areaId = localStorage.getItem('areaId');
  // const areaName = localStorage.getItem('areaName');

  // useEffect(() => {
  //     api.get('profile', {
  //         headers: {
  //             Authorization: areaId,
  //         }
  //     }).then(response => {
  //         setAreas(response.data);
  //     })
  // }, [areaId]);

  const [areas, setAreas] = useState([]);

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
          {areas.map((area) => {
            return (
              <li key={area.Id}>
                {" "}
                <div>
                  <h3>{area.Nome}</h3>
                  <div>
                    <button
                      className="Delete-button"
                      /* onClick={() => handleDeleteArea(area.Id)} */ type="button"
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
                <p>{area.Descricao}</p>
              </li>
            );
          })}
        </ul>
        <div className="Pagination">
          <a>1 2 3 4</a>
        </div>
      </div>
    </>
  );
}

export default Lobby;
