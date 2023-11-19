import React from "react";
import "./confirmationModal.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button className="Confirm" onClick={onConfirm}>
          Confirmar
        </button>
        <button className="Cancel" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
