import React, { useState } from "react";
import { setCheckedImages } from "../redux/slices/images.slice";
import { useAppDispatch } from "../redux/hooks";

const ImagesCheckbox = ({ imageId }) => {
  const dispatch = useAppDispatch();
  const [checkBoxStyle, setCheckBoxStyle] = useState("tasks__checkBox");
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    dispatch(setCheckedImages({ imageId: imageId, isChecked }));
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
