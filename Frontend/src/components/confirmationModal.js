import React from "react";
import "./confirmationModal.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button className="Confirmar-area" onClick={onConfirm}>
          Confirmar
        </button>
        <button className="Cancelar-area" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
