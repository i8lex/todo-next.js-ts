import React from "react";
import Modal from "react-modal";
// import { repeatEmailHandler } from "./handlers/repeatEmailHandler";
// import { useEmailRepeatMutation } from "../providers/redux/auth/authApi";

Modal.setAppElement("#__next");

export const ModalAuth = ({ email, open, handleClose, message, confirmed }) => {
  // const [emailRepeat] = useEmailRepeatMutation();
  const repeatEmailHandler = async () => {
    try {
      const value = { email: email };
      console.log(value);
      // await emailRepeat(value);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Modal
      email={email}
      isOpen={open}
      onClose={handleClose}
      message={message}
      confirmed={confirmed}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
        content: {
          maxWidth: "600px",
          maxHeight: "300px",
          margin: "0 auto",
          border: "none",
          borderRadius: "10px",
          padding: "20px",
        },
      }}
    >
      <div className="login__modal">
        <button
          className="login__modal__close"
          type="button"
          onClick={handleClose}
        >
          <></>
        </button>
        <h1 className="login__modal__title">
          {JSON.stringify(message, null, 2).replace(/["']/g, "")}
        </h1>
        {confirmed === false ? (
          <button className="login__modal__button" onClick={repeatEmailHandler}>
            RESEND CONFIRMATION EMAIL
          </button>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  );
};
