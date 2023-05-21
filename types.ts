export type ModalAuthProps = {
  className: string;
  email: string;
  open: boolean;
  onClose: () => void;
  handleClose: () => void;
  confirmed: string;
  message: string;
};
