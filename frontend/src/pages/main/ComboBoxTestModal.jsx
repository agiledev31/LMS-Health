import { Fragment, useEffect, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";

import { useQuiz } from "../../hooks/useQuiz";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/authProvider";
import { useExam } from "../../providers/examProvider";
import { useData } from "../../providers/learningDataProvider";
import { Spinner, TinySpinner } from "../../components/icons/Spinner";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function ComboBoxTestModal({
  setCurrentSelectedMatieres,
  currentSelectedMatieres,
  filteredMatieres,
  setMatiereQuery,
  matiereQuery,
  setCurrentSelectedItems,
}) {
  return (
    <Combobox
      as="div"
      multiple
      value={currentSelectedMatieres}
      onChange={(matiere) => {
        setCurrentSelectedItems([]);
        setCurrentSelectedMatieres(matiere);
      }}
    >
      <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
        Matiere
      </Combobox.Label>
      <div className="relative">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          onChange={(event) => setMatiereQuery(event.target.value)}
          displayValue={(matiere_id) => "Select one or more"}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredMatieres.length > 0 && (
          <Combobox.Options className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredMatieres.map((matiere) => (
              <Combobox.Option
                key={matiere._id}
                value={matiere._id}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-primary-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <div className="flex items-center">
                      <img
                        src={matiere.image}
                        alt={matiere.name}
                        className="h-6 w-6 flex-shrink-0 rounded-full"
                      />
                      <span
                        className={classNames(
                          "ml-3 truncate",
                          selected && "font-semibold"
                        )}
                      >
                        {matiere.name}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-primary-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
