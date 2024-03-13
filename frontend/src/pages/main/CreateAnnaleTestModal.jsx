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
import ComboBoxTestModal from "./ComboBoxTestModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function CreateAnnaleTestModal() {
  const { user } = useAuth();
  const { loadQuestions } = useQuiz();

  const [currentSelectedMatieres, setCurrentSelectedMatieres] = useState([]);
  const [currentSelectedItems, setCurrentSelectedItems] = useState([]);

  const { matieres, items } = useData();
  const {
    setQuestions,
    showCreateAnnaleTestModal,
    setShowCreateAnnaleTestModal,
  } = useExam();
  const navigator = useNavigate();
  const authHttpClient = useAuthHttpClient();
  const [isUploading, setIsUploading] = useState(false);
  const [rank, setRank] = useState("All");
  const [history, setHistory] = useState("Both");
  const [n_questions, setN_questions] = useState(0);
  const [total_questions, setTotalQuestions] = useState(0);
  const [modeExam, setEnabled] = useState(false);
  const [matiereQuery, setMatiereQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  useEffect(() => {
    console.log(total_questions);
    setN_questions(total_questions);
  }, [total_questions]);

  const handleSubmit = async () => {
    if (n_questions == 0) {
      alert("Cannot create a test with 0 questions");
      return;
    }
    setIsUploading(true);
    try {
      const response = await authHttpClient.post(
        "/annales/filterRandomMultiple",
        {
          user_id: user._id,
          matieres_id: currentSelectedMatieres,
          items_id: currentSelectedItems,
          n_questions: n_questions,
          tags: selectedTags.map((tag) => tag._id),
          history,
          rang: rank,
          difficulty,
        }
      );
      setIsUploading(false);
      setQuestions(response.data.data);
      navigator("/exam");
      setShowCreateAnnaleTestModal(false);
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

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
      ? items
      : items.filter((item) => {
          return (
            item.name.toLowerCase().includes(itemQuery.toLowerCase()) ||
            String(item.item_number).includes(itemQuery.toLowerCase())
          );
        });
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [counting, setCounting] = useState(false);
  const [tagQuery, setTagQuery] = useState("");

  useEffect(() => {
    if (currentSelectedItems.length == 0) {
      setTotalQuestions(0);
      return;
    }
    const countQuestions = async () => {
      setCounting(true);
      const response = await authHttpClient.post("/annales/countMultiple", {
        user_id: user._id,
        matieres_id: currentSelectedMatieres,
        items_id: currentSelectedItems,
        tags: selectedTags.map((tag) => tag._id),
        history,
        rang: rank,
        difficulty,
      });
      setTotalQuestions(response.data.data);
      setCounting(false);
    };
    countQuestions();
  }, [
    rank,
    history,
    selectedTags,
    currentSelectedItems,
    currentSelectedMatieres,
    user,
    difficulty,
  ]);

  /**
   *  When a matiere is selected, select all items related to that matiere.
   */
  useEffect(() => {
    let aux_selected_items = [...currentSelectedItems];

    for (let item of items) {
      if (aux_selected_items.includes(item._id)) continue;
      if (!currentSelectedMatieres.includes(item.matiere_id)) continue;

      aux_selected_items.push(item._id);
    }
    setCurrentSelectedItems(aux_selected_items);
  }, [currentSelectedMatieres]);

  /**
   *  When an item is selected ( or deselected ), select all items related to that matiere.
   */
  useEffect(() => {}, [currentSelectedItems]);

  const filteredTags =
    tagQuery === ""
      ? tags
      : tags.filter((tag) => {
          return tag.name.toLowerCase().includes(tagQuery.toLowerCase());
        });

  if (!showCreateAnnaleTestModal) return;

  return (
    showCreateAnnaleTestModal && (
      <div className="fixed w-[100vw] z-[9998] h-[100vh] top-0 left-0 flex items-center justify-center h-screen bg-[rgba(0,0,0,0.2)] backdrop-blur">
        <div className="relative z-[9999] w-[80vw] h-[80vh] max-w-[1200px] transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
          <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl overflow-hidden">
            <div className="px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="leading-6 text-gray-900 font-extrabold text-lg">
                  Create a test
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => setShowCreateAnnaleTestModal(false)}
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
                <ComboBoxTestModal
                  currentSelectedMatieres={currentSelectedMatieres}
                  setCurrentSelectedMatieres={setCurrentSelectedMatieres}
                  filteredMatieres={filteredMatieres}
                  setMatiereQuery={setMatiereQuery}
                  matiereQuery={matiereQuery}
                  setCurrentSelectedItems={setCurrentSelectedItems}
                />
                <div className="flex gap-2 m-2 flex-wrap">
                  {currentSelectedMatieres.map((el) => (
                    <span class="inline-flex items-center rounded-full bg-[#9896EC] px-2 py-1 text-xs font-medium text-[#fff] ring-1 ring-inset ring-[#6361D9] px-3 py-1">
                      {matieres.find((x) => x._id == el).name}
                    </span>
                  ))}
                </div>
                {/*   select item    */}
                <Combobox
                  as="div"
                  multiple
                  value={currentSelectedItems}
                  onChange={(items) => {
                    setCurrentSelectedItems(items);
                  }}
                >
                  <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                    Items
                  </Combobox.Label>
                  <div className="relative">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      onChange={(event) => setItemQuery(event.target.value)}
                      displayValue={(matiere_id) => "Select one or more"}
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
                <div className="flex gap-2 m-2 flex-wrap">
                  {currentSelectedItems.map((el) => (
                    <span class="inline-flex items-center rounded-full bg-[#9896EC] px-2 py-1 text-xs font-medium text-[#fff] ring-1 ring-inset ring-[#6361D9]">
                      {items.find((x) => x._id == el).name}
                    </span>
                  ))}
                </div>
                <div className="flex justify-around">
                  <div>
                    <div className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                      Rang
                    </div>
                    <div className=" flex max-w-fit border-2 divide-x-2 rounded-lg">
                      <div
                        onClick={() => setRank("A")}
                        className={classNames(
                          "hover:cursor-pointer rounded-l text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                          rank === "A" && "bg-gray-200 text-black"
                        )}
                      >
                        Rang A
                      </div>
                      <div
                        onClick={() => setRank("B")}
                        className={classNames(
                          "hover:cursor-pointer text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                          rank === "B" && "bg-gray-200 text-black"
                        )}
                      >
                        Rang B
                      </div>
                      <div
                        onClick={() => setRank("All")}
                        className={classNames(
                          "hover:cursor-pointer rounded-r text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                          rank === "All" && "bg-gray-200 text-black"
                        )}
                      >
                        All
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                      History
                    </div>
                    <div className=" flex max-w-fit border-2 divide-x-2 rounded-lg">
                      <div
                        onClick={() => setHistory("Tried")}
                        className={classNames(
                          "hover:cursor-pointer rounded-l text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                          history === "Tried" && "bg-gray-200 text-black"
                        )}
                      >
                        Tried
                      </div>
                      <div
                        onClick={() => setHistory("Never tried")}
                        className={classNames(
                          "hover:cursor-pointer text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                          history === "Never tried" && "bg-gray-200 text-black"
                        )}
                      >
                        Never tried
                      </div>
                      <div
                        onClick={() => setHistory("Both")}
                        className={classNames(
                          "hover:cursor-pointer rounded-r text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                          history === "Both" && "bg-gray-200 text-black"
                        )}
                      >
                        Both
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                      Difficulty
                    </div>
                    <div className=" flex max-w-fit border-2 divide-x-2 rounded-lg">
                      <div
                        onClick={() => {
                          setDifficulty("succeded");
                        }}
                        className={classNames(
                          "hover:cursor-pointer rounded-l text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                          difficulty === "succeded" && "bg-gray-200 text-black"
                        )}
                      >
                        Succeded
                      </div>
                      <div
                        onClick={() => setDifficulty("not succeded")}
                        className={classNames(
                          "hover:cursor-pointer text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                          difficulty === "not succeded" &&
                            "bg-gray-200 text-black"
                        )}
                      >
                        Not succeded
                      </div>
                      <div
                        onClick={() => {
                          setDifficulty("all");
                        }}
                        className={classNames(
                          "hover:cursor-pointer rounded-r text-left block text-sm leading-6 text-gray-900 py-1 px-3",
                          difficulty === "all" && "bg-gray-200 text-black"
                        )}
                      >
                        All
                      </div>
                    </div>
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
                                    (selectedTag) => selectedTag._id !== tag._id
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
                        onChange={(event) => setTagQuery(event.target.value)}
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
                  Number of questions:
                  {/* {total_questions} */}
                  {/* {counting ? (
                    <TinySpinner />
                  ) : (
                    `${n_questions}/${total_questions}`
                  )} */}
                </label>
                {/* <input class="numberstyle" type="number" min="1" step="1" value="1"></input> */}
                <div className="block">
                  <span
                    className="input-number-decrement border h-[40px] w-[30] font-bold text-center cursor-pointer"
                    onClick={() => {
                      if (n_questions >= 1) setN_questions(n_questions - 1);
                    }}
                  >
                    –
                  </span>
                  <input
                    className="input-number"
                    id="minmax-range"
                    type="text"
                    value={n_questions}
                    onChange={(e) =>
                      e.target.value > 0 &&
                      e.target.value <= total_questions &&
                      setN_questions(e.target.value)
                    }
                    min={Math.min(1, total_questions)}
                    max={total_questions}
                  />
                  <span
                    className="input-number-increment  border h-[40px] w-[30] font-bold text-center cursor-pointer"
                    onClick={() => {
                      if (n_questions < total_questions)
                        setN_questions(n_questions + 1);
                    }}
                  >
                    +
                  </span>
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

              <button
                onClick={() => {
                  setShowCreateAnnaleTestModal(false);
                }}
                type="button"
                className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-white-600 text-black mr-3 px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
              >
                {isUploading && <Spinner small />}Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
