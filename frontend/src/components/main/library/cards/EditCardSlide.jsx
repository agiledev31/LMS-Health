import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import useAuthHttpClient from "../../../../hooks/useAuthHttpClient";
import { Spinner } from "../../../icons/Spinner";
import CardEditor from "../../../common/Editor";
import { useData } from "../../../../providers/learningDataProvider";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function EditCardSlide({ open, setOpen, selectedCard, setCards }) {
  const authHttpClient = useAuthHttpClient();
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { items } = useData();
  const [content, setContent] = useState();
  useEffect(() => {
    if (selectedCard) {
      setSelectedItems(
        items.filter((item) =>
          selectedCard.items.map((item) => item._id).includes(item._id)
        )
      );
    }
  }, [selectedCard, items]);

  useEffect(() => {
    setLoading(true);
    const fetchCard = async () => {
      try {
        const response = await authHttpClient.get(`/card/${selectedCard._id}`);
        setCard(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCard();
  }, [selectedCard]);

  const updateCard = async (e) => {
    setIsUpdating(true);
    try {
      const response = await authHttpClient.put(`/card/${card._id}`, {
        ...card,
        content,
        items: selectedItems.map((item) => item._id),
      });
      console.log(response.data.data);
      setIsUpdating(false);
      setOpen(false);
      setCards((cards) =>
        cards.map((_) => (card._id === _._id ? response.data.data : _))
      );
    } catch (error) {
      setIsUpdating(false);
      console.log(error);
    }
  };

  const deleteCard = async (e) => {
    setIsDeleting(true);
    try {
      await authHttpClient.delete(`/card/${card._id}`);
      setIsUpdating(false);
      setOpen(false);
      setCards((cards) => cards.filter((_) => card._id !== _._id));
    } catch (error) {
      setIsDeleting(false);
      console.log(error);
    }
  };

  const [query, setQuery] = useState("");
  const filteredItems =
    query === ""
      ? items
      : items.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="leading-6 text-gray-900 font-extrabold text-lg">
                          <input
                            type="text"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                            value={card.name}
                            onChange={(e) => {
                              setCard((card) => ({
                                ...card,
                                name: e.target.value,
                              }));
                            }}
                          />
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-2 flex-1 px-4 sm:px-6">
                      <div className="text-sm mb-4">
                        <Combobox
                          as="div"
                          value={selectedItems}
                          onChange={setSelectedItems}
                          multiple
                        >
                          <Combobox.Label className="text-left block text-sm font-medium leading-6 text-gray-900">
                            Select Items
                          </Combobox.Label>

                          {selectedItems.length > 0 && (
                            <div className="flex gap-2 flex-wrap my-2">
                              {selectedItems.map((item) => (
                                <div
                                  className="px-2  hover:text-red-900 hover:border-red-900 hover:cursor-pointer min-w-fit border border-gray-400 rounded-md text-[12px]"
                                  onClick={() =>
                                    setSelectedItems(
                                      selectedItems.filter(
                                        (selectedItem) =>
                                          selectedItem._id !== item._id
                                      )
                                    )
                                  }
                                >
                                  {item.item_number}. {item.name}
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="relative mt-2">
                            <Combobox.Input
                              placeholder="search items..."
                              className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                              onChange={(event) => setQuery(event.target.value)}
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
                                {filteredItems.map((matiere) => (
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
                                              active
                                                ? "text-white"
                                                : "text-primary-600"
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
                      </div>
                      <CardEditor
                        content={card.content}
                        setContent={setContent}
                      />
                    </div>
                    <div className="mt-4 flex flex-row-reverse justify-between gap-2 mx-6 mb-4">
                      <button
                        onClick={() => {
                          updateCard();
                        }}
                        type="button"
                        className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
                      >
                        {isUpdating && <Spinner small />}Update Card
                      </button>
                      <button
                        onClick={() => {
                          deleteCard();
                        }}
                        type="button"
                        className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-red-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
                      >
                        {isDeleting && <Spinner small />}Delete Card
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default EditCardSlide;
