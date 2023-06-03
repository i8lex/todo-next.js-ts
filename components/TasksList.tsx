import React, { FC } from "react";
import { format, parseISO } from "date-fns";
import { Timer } from "./Timer";
import TasksCheckBox from "./TasksCheckBox";
// import { useGetThumbsQuery } from "../providers/redux/images/imageApi";
import { ThumbsList } from "./ThumbsList";
import { AddTask, DeleteConfirmModal, EditModal, Task } from "@/types";
import {
  useDeleteTaskMutation,
  usePathTaskMutation,
} from "@/redux/api/tasks.api";

type TasksListProps = {
  task: Task;
  setDeleteConfirmModal: React.Dispatch<
    React.SetStateAction<DeleteConfirmModal>
  >;
  setEditModal: React.Dispatch<React.SetStateAction<EditModal>>;
};

export const TasksList: FC<TasksListProps> = ({
  task,
  setDeleteConfirmModal,
  setEditModal,
}) => {
  const [deleteTask] = useDeleteTaskMutation();
  const [pathTask] = usePathTaskMutation();
  return (
    <li className="tasks__itemBox">
      <div className="tasks__item">
        <div className="tasks__item__container">
          <h4 className="tasks__item__title">{task.title}</h4>
          <p className="tasks__item__description">{task.description}</p>
          <div className="tasks__item__dateBox">
            <div>
              <p className="tasks__item__dateText">Created at:</p>
              <p className="tasks__item__date">
                {task.created && format(parseISO(task.created), "d MMM yyyy")}
              </p>
              <p className="tasks__item__date">
                {task.created && format(parseISO(task.created), "HH:mm:ss")}
              </p>
            </div>
            <div>
              <p className="tasks__item__dateText">Deadline at:</p>
              {task.deadline !== "1970-01-01T00:00:00.000Z" ? (
                <>
                  <p className="tasks__item__date">
                    {task.deadline &&
                      format(parseISO(task.deadline), "d MMM yyyy")}
                  </p>
                  <p className="tasks__item__date">
                    {task.deadline &&
                      format(parseISO(task.deadline), "HH:mm:ss")}
                  </p>
                </>
              ) : (
                <p className="tasks__item__date">Not set</p>
              )}
            </div>

            {task.deadline ? <Timer deadline={task.deadline} /> : null}
          </div>
          <div className="tasks__item__iconBox">
            <button
              className="tasks__modalEdit__iconBtn"
              onClick={() => {
                setEditModal({
                  isOpen: true,
                  data: {
                    title: task.title,
                    description: task.description,
                    deadline: task.deadline,
                  },
                  handleConfirm: async (values: AddTask) => {
                    try {
                      if (task._id) {
                        await pathTask({ id: task._id, body: values });
                      }

                      setEditModal((prevState) => ({
                        ...prevState,
                        isOpen: false,
                      }));
                    } catch (error) {}
                  },
                  title: `Update ${task.title}`,
                });
              }}
            >
              <></>
            </button>

            <button
              className="tasks__delete__button"
              type="button"
              onClick={() =>
                setDeleteConfirmModal({
                  isOpen: true,
                  title: task.title,
                  handleConfirm: async () => {
                    if (task._id) {
                      await deleteTask(task._id);
                    }
                  },
                })
              }
            >
              <></>
            </button>

            {task._id && <TasksCheckBox taskId={task._id} />}
          </div>
        </div>
        {task._id && task.images && (
          <ThumbsList _id={task._id} images={task.images} />
        )}
      </div>
    </li>
  );
};
