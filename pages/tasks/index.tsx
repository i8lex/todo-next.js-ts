import React, { useState } from "react";
import { Form, Formik } from "formik";
import { Input } from "@/components/Input";
import {
  useGetTasksQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
} from "@/redux/api/tasks.api";
import { ModalDeleteConfirm } from "@/components/ModalDeleteConfirm";
import { form } from "@/constants/form";
import { ModalEditProject } from "@/components/ModalEditProject";
import { TasksList } from "@/components/TasksList";
import { clearTasks } from "@/redux/slices/tasks.slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { DeleteConfirmModal, EditModal } from "@/types";

const TasksPage = () => {
  const { data: tasks = [], isLoading } = useGetTasksQuery();
  const [addTask] = useAddTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const [deleteConfirmModal, setDeleteConfirmModal] =
    useState<DeleteConfirmModal>({
      isOpen: false,
      title: "",
      handleConfirm: () => {},
    });
  const [editModal, setEditModal] = useState<EditModal>({
    isOpen: false,
    title: "",
    data: {},
    handleConfirm: () => {},
  });

  const dispatch = useAppDispatch();
  const { tasks: checkedTasks } = useAppSelector((state) => state.tasks);

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
                <Input
                  name="title"
                  label="Title"
                  required={true}
                  id="createTaskTitle"
                  as="input"
                  type="text"
                  step={1}
                />
                <Input
                  name="description"
                  as="textarea"
                  label="Description"
                  required={false}
                  id="createTaskDescription"
                  type="text"
                  step={1}
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
                        setDeleteConfirmModal((prevState: any) => ({
                          ...prevState,
                          isOpen: true,
                          handleConfirm: async () => {
                            await deleteTask(checkedTasks);
                            dispatch(clearTasks());
                          },
                        }))
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
            {tasks.map((task, index) => {
              return (
                <TasksList
                  key={task._id}
                  task={task}
                  setDeleteConfirmModal={setDeleteConfirmModal}
                  setEditModal={setEditModal}
                />
              );
            })}
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
