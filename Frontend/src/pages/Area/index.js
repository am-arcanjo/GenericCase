import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function Area() {
  const { id } = useParams();
  const [area, setArea] = useState(null);

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
    <div>
      <h1>{area.nome}</h1>
      <p>{area.descricao}</p>

      <h2>Processos:</h2>
      <ul>
        {area.processos &&
          area.processos.map((processo) => (
            <li key={processo.nome}>
              <strong>{processo.nome}</strong>
              {processo.subprocessos && processo.subprocessos.length > 0 && (
                <ul>
                  {processo.subprocessos.map((subprocesso) => (
                    <li key={subprocesso.nome}>{subprocesso.nome}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Area;
