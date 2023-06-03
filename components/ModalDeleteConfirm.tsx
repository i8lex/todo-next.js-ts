import React, { FC } from "react";
import Modal from "react-modal";

type ModalDeleteConfirmProps = {
  title?: string;
  isOpen: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
};

export const ModalDeleteConfirm: FC<ModalDeleteConfirmProps> = ({
  title,
  isOpen,
  handleClose,
  handleConfirm,
}) => {
  return (
    <Modal
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
        content: {
          maxWidth: "300px",
          maxHeight: "200px",
          margin: "0 auto",
          border: "none",
          borderRadius: "10px",
          padding: "20px",
        },
      }}
      isOpen={isOpen}
      onRequestClose={handleClose}
    >
      <div className="tasks__delete">
        <div className="tasks__delete__textBox">
          <p className="tasks__delete__text">Are you sure want delete?</p>
          <h5 className="tasks__delete__title">{title}</h5>
        </div>
        <div className="tasks__delete__btnBox">
          <button
            className="tasks__delete__btn"
            type="button"
            onClick={() => {
              handleConfirm();
              handleClose();
            }}
          >
            Yes
          </button>
          <button
            className="tasks__delete__btn"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
