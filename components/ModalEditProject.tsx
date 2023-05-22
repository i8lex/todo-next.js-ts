import React from "react";
import Modal from "react-modal";
import { Formik, Form } from "formik";
import { form } from "../constants/form";
import { Input } from "./Input";

Modal.setAppElement("#__next");

export const ModalEditProject = ({
  title,
  isOpen,
  handleClose,
  handleConfirm,
  data,
}) => {
  // const [isEditMode, setIsEditMode] = useState(false);
  // const handleEditClick = () => {
  //   setIsEditMode(true);
  // };
  // const handleTextOnBlur = () => {
  //   setIsEditMode(false);
  // };
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      contentLabel={title}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
        content: {
          maxWidth: "500px",
          maxHeight: "500px",
          margin: "0 auto",
          border: "none",
          borderRadius: "10px",
          padding: "20px",
        },
      }}
    >
      <div className="tasks__modalEdit">
        <h4 className="tasks__modalEdit__title">{title}</h4>
        <Formik
          validationSchema={form.projectsValidationSchema}
          initialValues={{
            title: data.title,
            description: data.description,
            deadline: data.deadline,
          }}
          onSubmit={handleConfirm}
        >
          <Form>
            <Input label="Title" required name="title" />
            <Input label="Description" as="textarea" name="description" />
            <Input
              label="Deadline"
              type="datetime-local"
              step="1"
              name="deadline"
            />
            <div style={{ textAlign: "right" }}>
              <button type="submit" className="tasks__button">
                Yes
              </button>
              <button
                type="button"
                className="tasks__button"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </Modal>
  );
};
