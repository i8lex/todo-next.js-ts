import React, { useState } from "react";
import { Form, Formik } from "formik";
import { Input } from "../../components/Input";
import {
  useGetTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  usePathTaskMutation,
} from "../../redux/api/tasks.api";
import { ModalDeleteConfirm } from "../../components/ModalDeleteConfirm";
import { form } from "../../constants/form";
import { ModalEditProject } from "../../components/ModalEditProject";
import { TasksList } from "../../components/TasksList";
import { clearTasks } from "../../redux/slices/tasks.slice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

const TasksPage = () => {
  const { data = [], isLoading } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [pathTask] = usePathTaskMutation();
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    title: "",
  });
  const dispatch = useAppDispatch();
  const { tasks: checkedTasks } = useAppSelector((state) => state.tasks);

  const [editModal, setEditModal] = useState({
    isOpen: false,
    title: "",
    data: {},
    handleConfirm: () => {},
  });

  if (isLoading) {
    return <h1>...LOADING...</h1>;
  }

  return (
    <section className="tasks">
      <div className="container">
        <div className="tasks__wrapper">
          <div>
            <Formik
              initialValues={{
                title: "",
                description: "",
                done: false,
              }}
              onSubmit={async (values, formikHelpers) => {
                await addTask(values).unwrap();

                formikHelpers.resetForm();
              }}
              validationSchema={form.projectsValidationSchema}
            >
              <Form className="tasks__form">
                <h4 className="tasks__create">Create project</h4>
                <Input name="title" label="Title" required />
                <Input
                  name="description"
                  as="textarea"
                  label="Description"
                  required
                />
                <div className="tasks__buttonBox">
                  <button className="tasks__buttonCreate" type="submit">
                    Create
                  </button>
                  {checkedTasks.length ? (
                    <button
                      className="tasks__buttonDelete"
                      type="button"
                      onClick={() =>
                        setDeleteConfirmModal({
                          isOpen: true,
                          handleConfirm: async () => {
                            await deleteTask(`${checkedTasks}`);
                            dispatch(clearTasks([]));
                          },
                        })
                      }
                    >
                      Delete checked
                    </button>
                  ) : null}
                </div>
              </Form>
            </Formik>
          </div>
          <ul className="tasks__list">
            {data.map(
              ({ _id, title, description, created, deadline, images }) => {
                if (!deadline) {
                  deadline = "Not set";
                }
                if (!images) {
                  images = [];
                }
                return (
                  <TasksList
                    key={_id}
                    _id={_id}
                    created={created}
                    deadline={deadline}
                    description={description}
                    title={title}
                    setDeleteConfirmModal={setDeleteConfirmModal}
                    setEditModal={setEditModal}
                    deleteTask={deleteTask}
                    pathTask={pathTask}
                    images={images}
                  />
                );
              }
            )}
          </ul>
        </div>
      </div>
      <ModalDeleteConfirm
        isOpen={deleteConfirmModal.isOpen}
        title={deleteConfirmModal.title}
        handleClose={() => {
          setDeleteConfirmModal((prevState) => {
            return {
              ...prevState,
              isOpen: false,
            };
          });
        }}
        handleConfirm={deleteConfirmModal.handleConfirm}
      />
      <ModalEditProject
        isOpen={editModal.isOpen}
        title={editModal.title}
        data={editModal.data}
        handleClose={() => {
          setEditModal((prevState) => ({ ...prevState, isOpen: false }));
        }}
        handleConfirm={editModal.handleConfirm}
      />
    </section>
  );
};

export default TasksPage;
