import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import FilterIcon from "../icons/FilterIcon";

const options=  [
      { value: "matieres", label: "Matières" },
      { value: "items", label: "Items" },
    ]
export default function Filter() {
  return (
        <Popover
          as="div"
          className="relative inline-block text-left"
        >
          <div>
            <Popover.Button className="group font-medium text-gray-700 px-4 py-2 rounded-lg border-2 border-gray-400 flex justify-center items-center gap-2 hover:border-primary-600 click-action hover:text-primary-600">
              <FilterIcon />
              <span>Filters</span>
            </Popover.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
              <form className="space-y-4">
                {options.map((option, optionIdx) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`filter-${optionIdx}`}
                      name={`filter-${optionIdx}`}
                      defaultValue={option.value}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label
                      htmlFor={`filter-${optionIdx}`}
                      className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </form>
            </Popover.Panel>
          </Transition>
        </Popover>
  );
}
