import { Fragment, useEffect, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { Spinner, TinySpinner } from "../icons/Spinner";
import { useQuiz } from "../../hooks/useQuiz";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/authProvider";
import { useExam } from "../../providers/examProvider";
import { useData } from "../../providers/learningDataProvider";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function TakeTestModal() {
  const { user } = useAuth();
  const {
    openTakeTestModal,
    setOpenTakeTestModal,
    loadQuestions,
    selectedMatiere,
    selectedItem,
    setSelectedItem,
    setSelectedMatiere,
  } = useQuiz();
  const { matieres, items } = useData();
  const { setQuestions } = useExam();
  const navigator = useNavigate();
  const authHttpClient = useAuthHttpClient();
  const [isUploading, setIsUploading] = useState(false);
  const [counting, setCounting] = useState(false);
  const [rank, setRank] = useState("All"); // Rang: A, B, All
  const [history, setHistory] = useState("Both"); // Tried, Never tried, Both
  const [n_questions, setN_questions] = useState(1);
  const [total_questions, setTotalQuestions] = useState(1);
  const [modeExam, setEnabled] = useState(false);

  const handleSubmit = async () => {
    setIsUploading(true);
    try {
      const response = await authHttpClient.post("/question/filterRandom", {
        user_id: user._id,
        matiere_id: selectedMatiere,
        item_id: selectedItem,
        n_questions: n_questions,
        tags: selectedTags.map((tag) => tag._id),
        history,
        rang: rank,
      });
      setIsUploading(false);
      setOpenTakeTestModal(false);
      if (modeExam) {
        setQuestions(response.data.data);
        navigator("/exam");
      } else {
        loadQuestions(response.data.data);
        navigator("/quiz");
      }
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  const [matiereQuery, setMatiereQuery] = useState("");
  const filteredMatieres =
    matiereQuery === ""
      ? matieres
      : matieres.filter((matiere) => {
          return matiere.name
            .toLowerCase()
            .includes(matiereQuery.toLowerCase());
        });

  const [itemQuery, setItemQuery] = useState("");
  const filteredItems =
    itemQuery === ""
      ? items.filter((item) => item.matiere_id === selectedMatiere)
      : items.filter((item) => {
          return (
            (item.name.toLowerCase().includes(itemQuery.toLowerCase()) ||
              String(item.item_number).includes(itemQuery.toLowerCase())) &&
            item.matiere_id === selectedMatiere
          );
        });

  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagQuery, setTagQuery] = useState("");
  const filteredTags =
    tagQuery === ""
      ? tags
      : tags.filter((tag) => {
          return tag.name.toLowerCase().includes(tagQuery.toLowerCase());
        });
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await authHttpClient.get(`/tag/`);
        setTags(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    openTakeTestModal && fetchTags();
  }, [openTakeTestModal]);

  useEffect(() => {
    const countQuestions = async () => {
      setCounting(true);
      const response = await authHttpClient.post("/question/count", {
        user_id: user._id,
        matiere_id: selectedMatiere,
        item_id: selectedItem,
        tags: selectedTags.map((tag) => tag._id),
        history,
        rang: rank,
      });
      setTotalQuestions(response.data.data);
      if (response.data.data === 0) setN_questions(0);
      setCounting(false);
    };
    openTakeTestModal && countQuestions();
  }, [
    rank,
    history,
    selectedTags,
    selectedMatiere,
    selectedItem,
    user,
    openTakeTestModal,
  ]);

  return (
    <Transition.Root show={openTakeTestModal} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpenTakeTestModal}>
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
                          Create a test
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            onClick={() => setOpenTakeTestModal(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-2 flex-1 px-4 sm:px-6">
                      <div className="text-sm">
                        {/*   select matiere    */}
                        <Combobox
                          as="div"
                          value={selectedMatiere}
                          onChange={(matiere) => {
                            setSelectedItem(null);
                            setSelectedMatiere(matiere);
                          }}
                        >
                          <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                            Matiere
                          </Combobox.Label>
                          <div className="relative">
                            <Combobox.Input
                              className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                              onChange={(event) =>
                                setMatiereQuery(event.target.value)
                              }
                              displayValue={(matiere_id) =>
                                matieres.find(({ _id }) => matiere_id === _id)
                                  ?.name
                              }
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
                                        active
                                          ? "bg-primary-600 text-white"
                                          : "text-gray-900"
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
                        {/*   select item    */}
                        <Combobox
                          as="div"
                          value={selectedItem}
                          onChange={(item_id) => {
                            setSelectedMatiere(
                              matieres.find(
                                ({ _id }) =>
                                  _id ===
                                  items.find((item) => item._id === item_id)
                                    .matiere_id
                              )._id
                            );
                            setSelectedItem(item_id);
                          }}
                        >
                          <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                            Item
                          </Combobox.Label>
                          <div className="relative">
                            <Combobox.Input
                              className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                              onChange={(event) =>
                                setItemQuery(event.target.value)
                              }
                              displayValue={(item_id) =>
                                item_id &&
                                `${
                                  items.find(({ _id }) => item_id === _id)
                                    ?.item_number
                                }. ${
                                  items.find(({ _id }) => item_id === _id)?.name
                                }`
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
                                    value={item._id}
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
                        <div className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                          Rang
                        </div>
                        <div className=" flex max-w-fit border-2 border-primary-600 divide-x-2 divide-primary-600 rounded-lg">
                          <div
                            onClick={() => setRank("A")}
                            className={classNames(
                              "hover:cursor-pointer rounded-l text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                              rank === "A" && "bg-primary-600 text-white"
                            )}
                          >
                            Rang A
                          </div>
                          <div
                            onClick={() => setRank("B")}
                            className={classNames(
                              "hover:cursor-pointer text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                              rank === "B" && "bg-primary-600 text-white"
                            )}
                          >
                            Rang B
                          </div>
                          <div
                            onClick={() => setRank("All")}
                            className={classNames(
                              "hover:cursor-pointer rounded-r text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                              rank === "All" && "bg-primary-600 text-white"
                            )}
                          >
                            All
                          </div>
                        </div>
                        <div className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                          History
                        </div>
                        <div className="ml-4 space-y-2">
                          <div className="flex items-center">
                            <input
                              name="history"
                              type="radio"
                              checked={history === "Tried"}
                              onChange={() => setHistory("Tried")}
                              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                            <label className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                              Tried
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              name="history"
                              type="radio"
                              checked={history === "Never tried"}
                              onChange={() => setHistory("Never tried")}
                              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                            <label className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                              Never tried
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              name="history"
                              type="radio"
                              checked={history === "Both"}
                              onChange={() => setHistory("Both")}
                              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-600"
                            />
                            <label className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                              Both
                            </label>
                          </div>
                        </div>
                        {/* select tags */}
                        <Combobox
                          as="div"
                          value={selectedTags}
                          onChange={setSelectedTags}
                          multiple
                        >
                          <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                            Tags
                          </Combobox.Label>
                          <div className="gap-2">
                            {selectedTags && selectedTags.length > 0 && (
                              <div className="mt-1.5 flex-1 rounded-lg border-dashed border-2 border-gray-200 p-2">
                                <div className="flex gap-2 flex-wrap">
                                  {selectedTags.map((tag) => (
                                    <div
                                      className="px-2  hover:text-red-900 hover:border-red-900 hover:cursor-pointer min-w-fit border border-gray-400 rounded-md text-[12px]"
                                      onClick={() =>
                                        setSelectedTags(
                                          selectedTags.filter(
                                            (selectedTag) =>
                                              selectedTag._id !== tag._id
                                          )
                                        )
                                      }
                                    >
                                      {tag.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            <div className="relative mt-2">
                              <Combobox.Input
                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                                onChange={(event) =>
                                  setTagQuery(event.target.value)
                                }
                                // displayValue={(items) => { return items.map((item) => item.name).join(", "); }}
                              />
                              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                <ChevronUpDownIcon
                                  className="h-5 w-5 text-gray-400"
                                  aria-hidden="true"
                                />
                              </Combobox.Button>

                              {filteredTags.length > 0 && (
                                <Combobox.Options className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {filteredTags.map((tag) => (
                                    <Combobox.Option
                                      key={tag._id}
                                      value={tag}
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
                                              {tag.name}
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
                          </div>
                        </Combobox>
                        <label
                          for="minmax-range"
                          className="mt-4 mb-2 text-sm font-medium text-gray-90 inline-flex items-center"
                        >
                          Number of questions:{" "}
                          {counting ? (
                            <TinySpinner />
                          ) : (
                            `${n_questions}/${total_questions}`
                          )}
                        </label>
                        <input
                          id="minmax-range"
                          min={Math.min(1, total_questions)}
                          max={total_questions}
                          type="range"
                          value={n_questions}
                          onChange={(e) => setN_questions(e.target.value)}
                          className="w-full mt-2 mb-4 h-2 bg-primary-600 rounded-lg cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[20px] [&::-webkit-slider-thumb]:w-[20px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-primary-600 [&::-webkit-slider-thumb]:focus:ring-2 [&::-webkit-slider-thumb]:hover:ring-2"
                        />
                        <div className="mt-2 flex items-center gap-2">
                          <Switch
                            checked={modeExam}
                            onChange={setEnabled}
                            className={classNames(
                              modeExam ? "bg-primary-600" : "bg-gray-200",
                              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                            )}
                          >
                            <span className="sr-only">Use setting</span>
                            <span
                              aria-hidden="true"
                              className={classNames(
                                modeExam ? "translate-x-5" : "translate-x-0",
                                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                              )}
                            />
                          </Switch>
                          <div>
                            <div className="font-bold">Mode examen</div>
                            <div>
                              Entraîne toi sur une plateforme type des ECNi
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Separator */}
                    </div>
                    <div className="mt-4 mr-4 flex flex-row-reverse">
                      <button
                        onClick={() => {
                          handleSubmit();
                        }}
                        type="button"
                        className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
                      >
                        {isUploading && <Spinner small />}Create
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
