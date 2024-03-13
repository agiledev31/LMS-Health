import { Fragment, useEffect, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { Spinner } from "../icons/Spinner";
import { useQuiz } from "../../hooks/useQuiz";
import { useNavigate } from "react-router-dom";
import { useExam } from "../../providers/examProvider";
import { useData } from "../../providers/learningDataProvider";
import { select } from "d3";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function CreateTestAnnales() {
  const navigator = useNavigate();

  const { openCreateTestAnnales, setOpenCreateTestAnnales } = useQuiz();
  const authHttpClient = useAuthHttpClient();

  const { selectedDps, setDps, selectedQuestions, setQuestions } = useExam();

  const [currentDps, setCurrentDps] = useState([]);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  const { dps, questions, matieres, items } = useData();

  const [isLoading, setIsLoading] = useState(false);

  const createSerie = async () => {
    setIsLoading(true);
    const tempDps = [];
    const tempQuestions = [];
    for (let i = 0; i < currentDps.length; i++) {
      if (!currentDps[i].selected) continue;
      const response = await authHttpClient.get(
        `/dp/withDetails/${currentDps[i]._id}`
      );
      tempDps.push(response.data.data);
    }
    for (let i = 0; i < currentQuestions.length; i++) {
      if (!currentQuestions[i].selected) continue;

      const response = await authHttpClient.get(
        `/question/${currentQuestions[i]._id}`
      );
      tempQuestions.push(response.data.data);
    }

    setDps(tempDps);
    setQuestions(tempQuestions);
    setOpenCreateTestAnnales(false);
    setIsLoading(false);
    navigator("/exam/");
  };
  useEffect(() => {
    setCurrentDps(
      dps
        .filter((dp) => selectedDps.includes(dp._id))
        .map((dp) => {
          let dp_aux = dp;
          dp_aux.selected = true;
          dp_aux.collapsed = true;
          return dp_aux;
        })
    );
    setCurrentQuestions(
      questions
        .filter((q) => selectedQuestions.includes(q._id))
        .map((q) => {
          let q_aux = q;
          q_aux.selected = true;
          q_aux.collapsed = true;
          return q_aux;
        })
    );
  }, [openCreateTestAnnales]);

  const check = (id) => {
    let dps_aux = [...currentDps];
    dps_aux[id].selected = !dps_aux[id].selected;
    setCurrentDps(dps_aux);
  };
  const checkQuestion = (id) => {
    let questions_aux = [...currentQuestions];
    questions_aux[id].selected = !questions_aux[id].selected;
    setCurrentQuestions(questions_aux);
  };

  const swapCollapsed = (id) => {
    let dps_aux = [...currentDps];
    currentDps[id].collapsed = !currentDps[id].collapsed;
    setCurrentDps(dps_aux);
  };
  const swapCollapsedQuestion = (id) => {
    let question_aux = [...currentQuestions];
    currentQuestions[id].collapsed = !currentQuestions[id].collapsed;
    setCurrentQuestions(question_aux);
  };

  return (
    <Transition.Root show={openCreateTestAnnales} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={setOpenCreateTestAnnales}
      >
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
                  <div className="flex h-full flex-col overflow-y-scroll bg-white pt-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="leading-6 text-gray-900 font-extrabold text-lg">
                          Série personnalisée Annales
                        </Dialog.Title>
                      </div>
                      <Dialog.Description className="mt-3 ml-2 text-[0.9rem] mb-5">
                        Personnalise ta sélection
                      </Dialog.Description>
                    </div>

                    {/* DPS */}
                    {currentDps.map((dp, dp_index) => (
                      <span
                        key={dp_index}
                        class={classNames(
                          !dp.selected &&
                            "rounded-md bg-[#F9FAFB] px-2 py-1 mx-5 my-1 text-xs font-medium text-[#F9F5FF] ring-1 ring-inset ring-[#EAECF0] min-h-[50px]",
                          dp.selected &&
                            "rounded-md bg-[#F9F5FF] px-2 py-1 mx-5 my-1 text-xs font-medium text-[#F9F5FF] ring-1 ring-inset ring-[#7F56D9] min-h-[50px]"
                        )}
                      >
                        <div className="w-full inline-flex items-center mt-2 my-auto">
                          <div class="flex h-6 items-center">
                            <input
                              name="dp1"
                              type="checkbox"
                              checked={dp.selected}
                              onChange={() => {
                                check(dp_index);
                              }}
                              class="h-4 w-4 rounded border-gray-300 text-[#7F56D9] mr-2 focus:outline-none focus-visible:outline-none focus:ring-0"
                            />
                          </div>
                          <span
                            class={classNames(
                              !dp.selected &&
                                "inline-flex items-center rounded-full bg-[#F3F4F8] px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-[#D0D5DD]",
                              dp.selected &&
                                "inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10"
                            )}
                          >
                            DP {dp.dp_number}
                          </span>
                          <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-black ring-1 ring-inset ring-gray-500/10 ml-2">
                            {dp.questions.length} questions
                          </span>
                          <div
                            className="ml-auto mr-2"
                            onClick={() => swapCollapsed(dp_index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.8"
                              stroke="#7F56D9"
                              className={classNames(
                                "w-6 h-6 transition-all",
                                !dp.collapsed && "rotate-180"
                              )}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </div>
                        </div>
                        {!dp.collapsed && (
                          <div className="inline-flex items-center flex-wrap mt-3 mx-6 gap-1 mb-3">
                            {dp.matieres.map((matiere, index) => (
                              <span
                                key={index}
                                class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                              >
                                {matiere.name}
                              </span>
                            ))}
                            {dp.items.map((item, index) => (
                              <span
                                key={index}
                                class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 "
                              >
                                {item.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </span>
                    ))}

                    {/* QUESTIONS */}
                    {currentQuestions.map((question, q_index) => (
                      <span
                        key={q_index}
                        class={classNames(
                          !question.selected &&
                            "rounded-md bg-[#F9FAFB] px-2 py-1 mx-5 my-1 text-xs font-medium text-[#F9F5FF] ring-1 ring-inset ring-[#EAECF0] min-h-[50px]",
                          question.selected &&
                            "rounded-md bg-[#F9F5FF] px-2 py-1 mx-5 my-1 text-xs font-medium text-[#F9F5FF] ring-1 ring-inset ring-[#7F56D9] min-h-[50px]"
                        )}
                      >
                        <div className="w-full inline-flex items-center mt-2 my-auto">
                          <div class="flex h-6 items-center">
                            <input
                              type="checkbox"
                              checked={question.selected}
                              onChange={() => {
                                checkQuestion(q_index);
                              }}
                              class="h-4 w-4 rounded border-gray-300 text-[#7F56D9] mr-2 focus:outline-none focus-visible:outline-none focus:ring-0"
                            />
                          </div>
                          <span
                            class={classNames(
                              !question.selected &&
                                "inline-flex items-center rounded-full bg-[#F3F4F8] px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-[#D0D5DD]",
                              question.selected &&
                                "inline-flex items-center rounded-full bg-pink-50 px-2 py-1 text-xs font-medium text-pink-700 ring-1 ring-inset ring-pink-700/10"
                            )}
                          >
                            QI {question.question_number}
                          </span>
                          <div
                            className="ml-auto mr-2"
                            onClick={() => swapCollapsedQuestion(q_index)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.8"
                              stroke="#7F56D9"
                              className={classNames(
                                "w-6 h-6 transition-all",
                                !question.collapsed && "rotate-180"
                              )}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                              />
                            </svg>
                          </div>
                        </div>
                        {!question.collapsed && (
                          <div className="inline-flex items-center flex-wrap mt-3 mx-6 gap-1 mb-3">
                            {question.matieres.map((matiere, index) => (
                              <span
                                key={index}
                                class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                              >
                                {matieres.find((m) => m._id == matiere).name}
                              </span>
                            ))}
                            {question.items.map((item, index) => (
                              <span
                                key={index}
                                class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 "
                              >
                                {items.find((itm) => itm._id == item).name}
                              </span>
                            ))}
                          </div>
                        )}
                      </span>
                    ))}
                    <div className="h-[70px] mt-auto inline-flex">
                      <p className="my-auto ml-auto mr-6">
                        {currentDps.reduce(
                          (sum, next) => sum + next.selected,
                          0
                        )}
                        DPs,{" "}
                        {currentQuestions.reduce(
                          (sum, next) => sum + next.selected,
                          0
                        )}{" "}
                        QIs
                      </p>
                      <button
                        onClick={createSerie}
                        type="button"
                        class="rounded-md bg-[#7F56D9] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F9F5FF] my-auto mr-4"
                      >
                        {isLoading ? (
                          <Spinner small />
                        ) : (
                          <span>Créer une série</span>
                        )}
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
