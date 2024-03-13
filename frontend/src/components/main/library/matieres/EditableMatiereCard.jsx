import React from "react";
import { TrashIcon, Bars3Icon } from "@heroicons/react/24/outline";

const EditableMatiereCard = ({ matiere, editAction, deleteAction }) => {
  return (
    <div className="border-2 rounded-lg min-h-[200px] bg-white p-6 hover:shadow-lg hover:shadow-gray-300 hover:cursor-pointer">
      <div className="flex justify-between items-center">
          <img className="max-h-[80px] max-w-[160px] bg-gray-100 rounded-lg flex flex-col justify-end items-center" src={matiere.image} alt="card" />
        <div className="flex flex-col gap-2 pl-4">
          <button
            onClick={editAction}
            type="button"
            className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
          >
            Edit
            <Bars3Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          </button>
          <button
            onClick={deleteAction}
            type="button"
            className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
          >
            Delete
            <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="mt-4 py-2 text-2xl font-extrabold">{matiere.name}</div>
      <div>
        {matiere.n_items} items {matiere.n_questions} questions
      </div>
    </div>
  );
};

export default EditableMatiereCard;
