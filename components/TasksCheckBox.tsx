import React, { FC, useState } from "react";
import { toggleTask } from "@/redux/slices/tasks.slice";
import { useAppDispatch } from "@/redux/hooks";

type TasksCheckboxType = {
  taskId: string;
};
const TasksCheckBox: FC<TasksCheckboxType> = ({ taskId }) => {
  const dispatch = useAppDispatch();
  const [checkBoxStyle, setCheckBoxStyle] = useState("tasks__checkBox");
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    dispatch(toggleTask({ itemId: taskId, isChecked }));
    if (isChecked) {
      setCheckBoxStyle("tasks__checkBoxChecked");
    } else {
      setCheckBoxStyle("tasks__checkBox");
    }
  };

  return (
    <input
      className={checkBoxStyle}
      type="checkbox"
      onChange={handleCheckboxChange}
    />
  );
};

export default TasksCheckBox;
