import React from "react";

function Question({ question, num, active, onClick }) {
  var color;
  if (!question.result) {
    color = "text-white";
  } else if (question.result.score > 15) {
    color = "text-green-light";
  } else if (question.result.score > 3) {
    color = "text-orange-light";
  } else {
    color = "text-red-light";
  }
  return (
    <div
      onClick={onClick}
      className={`${
        active && "bg-primary-700"
      } hover:cursor-pointer mx-8 mb-1 p-1 min-w-fit text-left rounded-md text-primary-100 hover:bg-primary-700 active:bg-primary-600 focus:bg-primary-600`}
    >
      <i className={`ri-checkbox-blank-circle-fill px-2 ${color}`}></i>
      Question {num}
    </div>
  );
}

export default Question;
