import { Fragment, useEffect, useState } from "react";
import { Combobox, Popover, Switch, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

import useAuthHttpClient from "../../../hooks/useAuthHttpClient";

import FilterIcon from "../../icons/FilterIcon";
import { useData } from "../../../providers/learningDataProvider";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Filter({ filter, setFilter }) {
  const authHttpClient = useAuthHttpClient();
  const { matieres, items } = useData();

  const [selectedMatieres, setSelectedMatieres] = useState([]);
  const [matiereQuery, setMatiereQuery] = useState("");
  const filteredMatieres =
    matiereQuery === ""
      ? matieres
      : matieres.filter((matiere) => {
          return matiere.name
            .toLowerCase()
            .includes(matiereQuery.toLowerCase());
        });

  const [selectedItems, setSelectedItems] = useState([]);
  const [itemQuery, setItemQuery] = useState("");
  const filteredItems =
    itemQuery === ""
      ? items
      : items.filter((item) => {
          return (
            item.name.toLowerCase().includes(itemQuery.toLowerCase()) ||
            String(item.item_number).includes(itemQuery.toLowerCase())
          );
        });

  const clickHandle = () => {
    setFilter({
      matieres: selectedMatieres.map(({ _id }) => _id),
      items: selectedItems.map(({ _id }) => _id),
    });
  };

  return (
    <Popover as="div" className="relative inline-block text-left">
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
        <Popover.Panel className="w-[250px] absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          {/*   select matieres   */}
          <Combobox
            as="div"
            value={selectedMatieres}
            onChange={setSelectedMatieres}
            multiple
          >
            <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
              <div className="flex items-center">
                {/* <input
                  id={`filter-matieres`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                /> */}
                <label
                  htmlFor={`filter-matieres`}
                  className="whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                >
                  Matières
                </label>
              </div>
            </Combobox.Label>
            <div>
              <div className="relative mt-2 max-w-fit">
                <Combobox.Input
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setMatiereQuery(event.target.value)}
                  // displayValue={(items) => { return items.map((item) => item.name).join(", "); }}
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
                        value={matiere}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                            active
                              ? "bg-primary-600 text-white"
                              : "text-gray-900"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <div className="flex items-center">
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
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
              {selectedMatieres.length > 0 && (
                <div className="mt-1.5 flex-1 rounded-lg border-dashed border-2 border-gray-200 p-2">
                  <div className="flex gap-2 flex-wrap ">
                    {selectedMatieres.map((matiere, i) => (
                      <div
                        className="px-2  hover:text-red-900 hover:border-red-900 hover:cursor-pointer min-w-fit border border-gray-400 rounded-md text-[12px]"
                        onClick={() =>
                          setSelectedMatieres(
                            selectedMatieres.filter(
                              (_) => _._id !== matiere._id
                            )
                          )
                        }
                      >
                        {matiere.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Combobox>
          {/*   select items   */}
          <Combobox
            as="div"
            value={selectedItems}
            onChange={setSelectedItems}
            multiple
          >
            <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
              <div className="flex items-center">
                {/* <input
                  id={`filter-matieres`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                /> */}
                <label
                  htmlFor={`filter-matieres`}
                  className="whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                >
                  Items
                </label>
              </div>
            </Combobox.Label>
            <div>
              <div className="relative mt-2 max-w-fit">
                <Combobox.Input
                  className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  onChange={(event) => setItemQuery(event.target.value)}
                  // displayValue={(items) => { return items.map((item) => item.name).join(", "); }}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>

                {filteredItems.length > 0 && (
                  <Combobox.Options className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredItems.map((item) => (
                      <Combobox.Option
                        key={item._id}
                        value={item}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                            active
                              ? "bg-primary-600 text-white"
                              : "text-gray-900"
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <div className="flex items-center">
                              <span
                                className={classNames(
                                  "ml-3 truncate",
                                  selected && "font-semibold"
                                )}
                              >
                                {`${item.item_number}. ${item.name}`}
                              </span>
                            </div>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  active ? "text-white" : "text-primary-600"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
              {selectedItems.length > 0 && (
                <div className="mt-1.5 flex-1 rounded-lg border-dashed border-2 border-gray-200 p-2">
                  <div className="flex gap-2 flex-wrap ">
                    {selectedItems.map((item) => (
                      <div
                        className="px-2  hover:text-red-900 hover:border-red-900 hover:cursor-pointer min-w-fit border border-gray-400 rounded-md text-[12px]"
                        onClick={() =>
                          setSelectedItems(
                            selectedItems.filter(
                              (selectedItem) => selectedItem._id !== item._id
                            )
                          )
                        }
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Combobox>
          <div className="mt-4 flex flex-row-reverse gap-2">
            <button
              onClick={() => {
                clickHandle();
              }}
              type="button"
              className="click-action inline-flex justify-between border-2 border-gray-300 items-center gap-x-1.5 rounded-md  px-2.5 py-1.5 text-sm hover:bg-primary-600 hover:text-gray-50 hover:border-primary-600 text-primary-600 font-bold"
            >
              Apply
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
