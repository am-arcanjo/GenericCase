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
    </div>
  );
}

export default Area;
