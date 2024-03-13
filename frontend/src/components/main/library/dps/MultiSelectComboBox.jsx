import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MultiSelectComboBox = (items, selectedItems, setSelectedItems) => {
  const [query, setQuery] = useState("");
  const filteredItems =
    query === ""
      ? items
      : items.filter((item) => {
          return item.name.toLowerCase().includes(query.toLowerCase());
        });
  return (
    <Combobox
      as="div"
      value={selectedItems}
      onChange={setSelectedItems}
      multiple
    >
      <Combobox.Label className="text-left block text-sm font-medium leading-6 text-gray-900">
        Select Items
      </Combobox.Label>
      <div className="flex gap-2">
        <div className="relative mt-2 max-w-fit">
          <Combobox.Input
            className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(items) => {
              return "";
            }}
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
                      active ? "bg-primary-600 text-white" : "text-gray-900"
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
                          {item.name}
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
      </div>
    </Combobox>
  );
};
