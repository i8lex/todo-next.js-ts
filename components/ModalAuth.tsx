import React, { FC } from 'react';
import Modal from 'react-modal';
import { ModalAuthProps } from '@/types';
import { useEmailRepeatMutation } from '@/redux/api/auth.api';

Modal.setAppElement('#__next');

export const ModalAuth: FC<ModalAuthProps> = ({
  email,
  open,
  handleClose,
  message,
  confirmed,
}) => {
  console.log(confirmed);
  const [emailRepeat] = useEmailRepeatMutation();
  const repeatEmailHandler = async () => {
    try {
      const value = { email: email };

      // @ts-ignore
      await emailRepeat(value);
      // @ts-ignore
      handleClose();
    } catch (err) {
      console.log('error repeat send email');
    }
  };
  return (
    <Modal
      isOpen={open}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        content: {
          maxWidth: '600px',
          maxHeight: '300px',
          margin: '0 auto',
          border: 'none',
          borderRadius: '10px',
          padding: '20px',
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
          {JSON.stringify(message, null, 2).replace(/["']/g, '')}
        </h1>
        {confirmed || confirmed === undefined ? null : (
          <button className="login__modal__button" onClick={repeatEmailHandler}>
            RESEND CONFIRMATION EMAIL
          </button>
        )}
      </div>
    </Modal>
  );
};
