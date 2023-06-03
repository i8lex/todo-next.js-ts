import React, { ChangeEvent, FC, useState } from "react";
import { toggleImagesList } from "@/redux/slices/images.slice";
import { useAppDispatch } from "@/redux/hooks";

type ImagesCheckboxProps = {
  imageId: string;
};
const ImagesCheckbox: FC<ImagesCheckboxProps> = ({ imageId }) => {
  const dispatch = useAppDispatch();
  const [checkBoxStyle, setCheckBoxStyle] = useState("tasks__checkBox");

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    dispatch(toggleImagesList({ imageId: imageId, isChecked }));
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

export default ImagesCheckbox;
