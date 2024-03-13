import React from "react";

function Label({ children, colorInherit, color, onClick }) {
  var bgColor, borderColor, textColor;
  if (colorInherit) {
    bgColor = "bg-inherit";
    borderColor = "border-inherit";
    textColor = "text-inherit"
  } else if (color) {
    bgColor = `bg-${color}-50`;
    borderColor = `border-${color}-200`;
    textColor = `text-${color}-700`;
  } else {
    bgColor = `bg-grayBlue-50`;
    borderColor = `border-grayBlue-200`;
    textColor = `text-grayBlue-700`;
  }
  return (
    <div
      onClick={onClick}
      className={`${bgColor} ${borderColor} ${textColor}
      px-3 min-w-fit relative rounded-full border-2 max-w-fit flex items-center gap-2 ${
        onClick && "hover:cursor-pointer"
      }`}
    >
      {children}
    </div>
  );
}


export default Label;
