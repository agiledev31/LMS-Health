import React from "react";
import ProgressCircle from "../../../common/ProgressCircle";
import { useNavigate } from "react-router-dom";

function MatiereCard({ matiere }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/library/matiere/${matiere._id}`);
      }}
      className="border-2 rounded-lg min-h-[200px] bg-white p-6 hover:shadow-lg hover:shadow-gray-300 click-action hover:cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <img
          className="max-h-[80px] max-w-[160px] bg-gray-100 rounded-lg justify-end items-center"
          src={matiere.image}
          alt="card"
        />
        <ProgressCircle r={36} matiere={matiere} />
      </div>
      <div className="mt-4 py-2 text-2xl font-extrabold">{matiere.name}</div>
      <div>
        {matiere.n_items} items {matiere.n_questions} questions
      </div>
    </div>
  );
}

export default MatiereCard;
