import { useEffect, useState } from "react";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useAuth } from "../../providers/authProvider";
import Modal from "../common/Modal";
import { Spinner } from "../icons/Spinner";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { useData } from "../../providers/learningDataProvider";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function NewQuickAccessModal({
  open,
  setOpen,
  isSidebar = false,
  setQuickAccessItems,
}) {
  const { user } = useAuth();
  const authHttpClient = useAuthHttpClient();
  const { matieres, items } = useData();

  const [itemType, setType] = useState("Matiere"); // Matiere, Item

  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [matiereQuery, setMatiereQuery] = useState("");
  const filteredMatieres =
    matiereQuery === ""
      ? matieres
      : matieres.filter((matiere) => {
          return matiere.name
            .toLowerCase()
            .includes(matiereQuery.toLowerCase());
        });

  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQuery, setItemQuery] = useState("");
  const filteredItems =
    itemQuery === ""
      ? items.filter(
          (item) => !selectedMatiere || item.matiere_id === selectedMatiere._id
        )
      : items.filter((item) => {
          return (
            (item.name.toLowerCase().includes(itemQuery.toLowerCase()) ||
              String(item.item_number).includes(itemQuery.toLowerCase())) &&
            (!selectedMatiere || item.matiere_id === selectedMatiere._id)
          );
        });

  useEffect(() => {
    if (!open) {
      setSelectedItem(null);
      setSelectedMatiere(null);
    }
  }, [open]);

  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    setIsUploading(true);
    const endpoint = isSidebar ? "/quickaccess/sidebar" : "/quickaccess";
    try {
      const response = await authHttpClient.post(endpoint, {
        user_id: user._id,
        MatiereOrItem: itemType,
        matiere_or_item_id:
          itemType === "Matiere" ? selectedMatiere._id : selectedItem._id,
      });
      setIsUploading(false);
      setQuickAccessItems((_) => [..._, response.data.data]);
      setOpen(false);
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="p-8 border-2 border-gray-500 rounded-lg bg-white">
        <div className="mb-4 text-xl flex justify-center font-bold">
          QuickAccess
        </div>

        <div className="grid grid-cols-2 border-2 border-primary-600 divide-x-2 divide-primary-600 rounded-lg">
          <div
            onClick={() => setType("Matiere")}
            className={classNames(
              "text-center hover:cursor-pointer rounded-l block text-sm leading-6 text-gray-900 py-1 px-3",
              itemType === "Matiere" && "bg-primary-600 text-white"
            )}
          >
            Matiere
          </div>
          <div
            onClick={() => setType("Item")}
            className={classNames(
              "hover:cursor-pointer text-center block text-sm leading-6 text-gray-900 py-1 px-3",
              itemType === "Item" && "bg-primary-600 text-white"
            )}
          >
            Item
          </div>
        </div>
        {/*   select matiere   */}
        <Combobox
          as="div"
          value={selectedMatiere}
          onChange={(matiere) => {
            setSelectedItem(null);
            setSelectedMatiere(matiere);
          }}
        >
          <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
            Select Matiere
          </Combobox.Label>
          <div className="relative">
            <Combobox.Input
              className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              onChange={(event) => setMatiereQuery(event.target.value)}
              displayValue={(matiere) => matiere?.name}
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
        {/*   select item    */}
        {itemType === "Item" && (
          <Combobox
            as="div"
            value={selectedItem}
            onChange={(item) => {
              setSelectedMatiere(
                matieres.find(({ _id }) => _id === item.matiere_id)
              );
              setSelectedItem(item);
            }}
          >
            <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
              Select Item
            </Combobox.Label>
            <div className="relative">
              <Combobox.Input
                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                onChange={(event) => setItemQuery(event.target.value)}
                displayValue={(item) =>
                  item && `${item.item_number}. ${item.name}`
                }
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
          </Combobox>
        )}
        <button
          onClick={() => {
            handleSubmit();
          }}
          type="button"
          className="mt-36 justify-center w-full click-action inline-flex border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
        >
          {isUploading ? <Spinner small center /> : "Add"}
        </button>
      </div>
    </Modal>
  );
}
