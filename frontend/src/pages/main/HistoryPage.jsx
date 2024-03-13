import React, { useEffect, useState } from "react";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  FolderOpenIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import Breadcrumb from "../../components/main/Breadcrumb";
import Tabs from "../../components/main/Tabs";
import All from "../../components/main/annales/All";
import MatOrItems from "../../components/main/annales/MatOrItems";
import Sessions from "../../components/main/annales/Sessions";
import { useExam } from "../../providers/examProvider";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components/icons/Spinner";
import { useQuiz } from "../../hooks/useQuiz";
import SearchField from "../../components/main/SearchField";
import { useAuth } from "../../providers/authProvider";
import { HttpStatusCode } from "axios";
import { useData } from "../../providers/learningDataProvider";
import { format } from "date-fns";
import SearchIcon from "../../components/icons/SearchIcon";
import HistoryModal from "./HistoryModal";

function AnnalesPage() {
  const navigator = useNavigate();

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  const [currentElement, setCurrentElement] = useState(null);
  const authHttpClient = useAuthHttpClient();
  const [searchText, setSearchText] = useState("");
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const { setResult, selectedDps, setDps, selectedQuestions, setQuestions } =
    useExam();

  const [showMatieres, setShowMatieres] = useState([]);
  const [showItems, setShowItems] = useState([]);
  const { matieres, items } = useData();

  const [testSource, setTestSource] = useState(-1);
  const [selectedMatiere, setSelectedMatiere] = useState(-1);
  const [selectedItem, setSelectedItem] = useState(-1);

  const [showTab, setShowTab] = useState(0);
  const navigate = useNavigate();
  const isExamFromLibrary = (item) => {
    return (
      item.history_data.dps.length == 0 &&
      (item.history_data.questions.length == 0 ||
        item.history_data.questions[0].session_id == undefined)
    );
  };

  const retakeExam = async (history_item) => {
    setIsLoading(true);
    const tempDps = [];
    const tempQuestions = [];
    for (let i = 0; i < history_item.history_data.dps.length; i++) {
      const response = await authHttpClient.get(
        `/dp/withDetails/${history_item.history_data.dps[i]._id}`
      );
      tempDps.push(response.data.data);
    }
    for (let i = 0; i < history_item.history_data.questions.length; i++) {
      const response = await authHttpClient.get(
        `/question/${history_item.history_data.questions[i]._id}`
      );
      tempQuestions.push(response.data.data);
    }

    setDps(tempDps);
    setQuestions(tempQuestions);
    setIsLoading(false);
    navigator("/exam/");
  };
  const hasSelectedMatiere = (item) =>
    item.actual_matieres.find((x) => x._id == matieres[selectedMatiere]._id);

  const hasSelectedItem = (item) =>
    item.actual_items.find((x) => x._id == items[selectedItem]._id);

  const filterHistory = (history_items) => {
    let aux = [...history_items];

    if (testSource == 0) {
      aux = aux.filter((item) => isExamFromLibrary(item));
    }
    if (testSource == 1) {
      aux = aux.filter((item) => !isExamFromLibrary(item));
    }

    if (selectedMatiere >= 0) {
      aux = aux.filter((item) => hasSelectedMatiere(item));
    }
    if (selectedItem >= 0) {
      aux = aux.filter((item) => hasSelectedItem(item));
    }

    if (showTab == 1) {
      console.log(aux);
      aux = aux.filter((item) => item.favorite);
    }
    return aux;
  };
  const filteredHistory = filterHistory(history);

  const viewExam = (result_item) => {
    let aux = result_item;
    aux.isPastExam = true;
    setResult(aux);
    setTimeout(() => {
      navigate("/result");
    }, 100);
  };

  const getItems = (item_ids) => {
    return item_ids
      .map((id) => items.find((itm) => itm._id == id))
      .filter((x) => x);
  };

  const getMatieres = (matiere_ids) => {
    return matiere_ids
      .map((id) => matieres.find((m) => m._id == id))
      .filter((x) => x);
  };

  const getAllMatieres = (result_element) => {
    console.log(result_element);
    let result = [];
    // fetch from dps
    for (let dp of result_element.history_data.dps) {
      result.push(...getMatieres(dp.matieres));
    }
    // fetch from qis
    for (let q of result_element.history_data.questions) {
      result.push(...getMatieres([q.matiere_id]));
    }
    return [...new Set(result)];
  };

  const getAllItems = (result_element) => {
    let result = [];
    // fetch from dps
    for (let dp of result_element.history_data.dps) {
      result.push(...getItems(dp.items));
    }
    // fetch from qis
    for (let q of result_element.history_data.questions) {
      result.push(...getItems([q.item_id]));
    }
    return [...new Set(result)];
  };

  useEffect(() => {
    const getHistory = async () => {
      const response = await authHttpClient.get(`/history/` + user._id, {
        user_id: user._id,
      });
      if (response.status == HttpStatusCode.Ok) {
        setIsLoading(false);
        let aux = response.data.data.map((el) => {
          let aux = el;
          aux.actual_matieres = getAllMatieres(el);
          aux.actual_items = getAllItems(el);
          return aux;
        });
        setHistory(aux);
      }
    };
    getHistory();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setShowItems(history.map((el) => false));

    setShowMatieres(history.map((el) => false));
  }, [history]);

  useEffect(() => {
    let aux = history.map((el) => {
      let aux = el;
      aux.actual_matieres = getAllMatieres(el);
      return aux;
    });
    setHistory(aux);
  }, [matieres]);

  useEffect(() => {
    let aux = history.map((el) => {
      let aux = el;
      aux.actual_items = getAllItems(el);
      return aux;
    });
    setHistory(aux);
  }, [items]);

  const pages = [{ name: "History", href: "/history/", current: true }];

  const computeTitle = (result_element) => {
    let result_string = "";
    const hasDPs = result_element.history_data.dps.length > 0;
    const hasQIs = result_element.history_data.questions.length > 0;

    if (hasDPs > 0) {
      result_string += result_element.history_data.dps.length + "DPs";
      result_string += hasQIs ? ", " : " ";
    }

    if (hasQIs) {
      result_string += result_element.history_data.questions.length + "QIs";
    }
    return result_string;
  };

  const getGlobalGrade = (result_item) => {
    const gradeFromDps =
      result_item.dps.reduce((acc, cur) => {
        if (cur.dp_total_score == 0) return 0;
        return acc + (cur.dp_user_score / cur.dp_total_score) * 20;
      }, 0) / result_item.dps.length || 0;

    const gradeFromQuestions =
      result_item.questions.reduce(
        (acc, cur) => acc + (cur.user_score / cur.total_score) * 20,
        0
      ) / result_item.questions.length || 0;

    const dp_to_question_ratio =
      result_item.dps.length /
      (result_item.questions.length + result_item.dps.length);

    return (
      gradeFromDps * dp_to_question_ratio +
      gradeFromQuestions * (1 - dp_to_question_ratio)
    );
  };

  const computeGlobalGrade = (result_item) => {
    return parseInt(getGlobalGrade(result_item)).toString() + "/ 20";
  };

  const toggleFavorite = async (result_item) => {
    const response = await authHttpClient.put(`/history/` + result_item._id, {
      favorite: !result_item.favorite,
    });
    if (response.status == HttpStatusCode.Ok) {
      let aux = history.map((el) => {
        if (el._id == result_item._id) {
          let aux = response.data.data;
          aux.actual_matieres = getAllMatieres(response.data.data);
          aux.actual_items = getAllItems(response.data.data);
          return aux;
        }

        return el;
      });
      setHistory([...aux]);
      setCurrentElement(null);
      // setHistory(aux);
    }
  };

  return (
    <>
      {isLoading && (
        <div
          role="status"
          className="h-[70vh] pb-20 flex justify-center items-center"
        >
          <Spinner />
        </div>
      )}
      {!isLoading && (
        <div>
          <div className="-mt-4 mb-6">
            <Breadcrumb pages={pages} />
          </div>
          <div className="flex justify-between">
            <div className="text-3xl font-bold">History</div>
          </div>

          <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
            {/* _____________________________________________________________________ */}

            <div
              className="isolate inline-flex -space-x-px rounded-md py-4 flex-wrap "
              aria-label="Pagination"
            >
              <div
                onClick={() => setShowTab(0)}
                className={classNames(
                  showTab == 0 ? "bg-gray-50" : "bg-white",
                  "hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 rounded-l-md"
                )}
              >
                All
              </div>
              <div
                onClick={() => setShowTab(1)}
                className={classNames(
                  showTab == 1 ? "bg-gray-50" : "bg-white",
                  " hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 rounded-r-md"
                )}
              >
                Fav
              </div>
            </div>

            <div className="mb-6">
              <div className="flex gap-5 p-4">
                <div className="flex-1">
                  <label
                    for="score"
                    class="block text-sm font-medium leading-6 text-gray-900 ml-2"
                  >
                    Score
                  </label>
                  <select
                    id="score"
                    name="score"
                    class="ml-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 h-[43px] font-bold"
                    value={testSource}
                    onChange={(e) => setTestSource(e.currentTarget.value)}
                  >
                    <option value={-1}>Library and annales</option>
                    <option value={0}>Library only</option>
                    <option value={1}>Annales only</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    for="matieres"
                    class="block text-sm font-medium leading-6 text-gray-900 ml-2"
                  >
                    Matieres
                  </label>
                  <select
                    id="matieres"
                    name="matieres"
                    class="ml-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 h-[43px] font-bold"
                    onChange={(e) => setSelectedMatiere(e.currentTarget.value)}
                  >
                    <option value={-1}>All</option>
                    {matieres.map((matiere, index) => (
                      <option value={index}>{matiere.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    for="items"
                    class="block text-sm font-medium leading-6 text-gray-900 ml-2"
                  >
                    Items
                  </label>
                  <select
                    id="items"
                    name="items"
                    class="ml-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 h-[43px] font-bold"
                    onChange={(e) => setSelectedItem(e.currentTarget.value)}
                  >
                    <option>All</option>
                    {items.map((item, index) => (
                      <option value={index}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg  divide-y-2 divide-gray-200">
              <div className="p-4 bg-white flex justify-between sm:rounded-t-lg gap-2">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="divide-y divide-gray-200 bg-white rounded">
                    <tr>
                      <th
                        scope="col"
                        className="min-w-[80px] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 flex items-center gap-2"
                      >
                        <div className="hover:cursor-pointer hover:text-primary-600 flex items-center max-w-fit">
                          Name of history
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[200px]"
                      >
                        <span>Matières</span>
                        <div className="my-auto mx-2"></div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[200px]"
                      >
                        <span>Items</span>
                        <div className="my-auto mx-2"></div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[200px]"
                      >
                        <span>Date taken</span>
                        <div className="my-auto mx-2"></div>
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[200px]"
                      >
                        <span>Score</span>
                        <div className="my-auto mx-2"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((result_element, result_index) => (
                      <tr className="even:bg-gray-50">
                        <td className="font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                          {computeTitle(result_element)}
                        </td>
                        <td className=" px-3 py-4 text-sm text-gray-500">
                          <div className="flex flex-wrap">
                            {result_element.actual_matieres &&
                            result_element.actual_matieres.length > 1 &&
                            !showMatieres[result_index] ? (
                              <>
                                <div
                                  className={classNames(
                                    "px-2 m-1 max-w-fit border border-gray-400 rounded-md text-[12px]"
                                  )}
                                >
                                  {result_element.actual_matieres[0].name}
                                </div>
                                <div
                                  onClick={() => {
                                    let aux = [...showMatieres];
                                    aux[result_index] = true;
                                    setShowMatieres(aux);
                                  }}
                                  className="px-2 m-1 max-w-fit text-[12px] hover:cursor-pointer hover:text-primary-600"
                                >
                                  {`${
                                    result_element.actual_matieres.length - 1
                                  } more`}
                                </div>
                              </>
                            ) : (
                              result_element.actual_matieres.map((matiere) => (
                                <div
                                  key={matiere._id}
                                  className={classNames(
                                    "px-2 m-1 max-w-fit border border-gray-400 rounded-md text-[12px]"
                                  )}
                                >
                                  {matiere.name}
                                </div>
                              ))
                            )}
                          </div>
                        </td>
                        <td className=" px-3 py-4 text-sm text-gray-500">
                          <div className="flex flex-wrap">
                            {result_element.actual_items &&
                            result_element.actual_items.length > 1 &&
                            !showItems[result_index] ? (
                              <>
                                <div
                                  className={classNames(
                                    "px-2 m-1 max-w-fit border border-gray-400 rounded-md text-[12px]"
                                  )}
                                >
                                  {result_element.actual_items[0].name}
                                </div>
                                <div
                                  onClick={() => {
                                    let aux = [...showItems];
                                    aux[result_index] = true;
                                    setShowItems(aux);
                                  }}
                                  className="px-2 m-1 max-w-fit text-[12px] hover:cursor-pointer hover:text-primary-600"
                                >
                                  {`${
                                    result_element.actual_items.length - 1
                                  } more`}
                                </div>
                              </>
                            ) : (
                              result_element.actual_items.map((item) => (
                                <div
                                  key={item._id}
                                  className={classNames(
                                    "px-2 m-1 max-w-fit border border-gray-400 rounded-md text-[12px]"
                                  )}
                                >
                                  {item.name}
                                </div>
                              ))
                            )}
                          </div>
                        </td>
                        <td className="pl-2 pr-3 text-sm text-gray-900 sm:pl-3">
                          {format(
                            new Date(result_element.taken_at),
                            "MMM dd, yyyy"
                          )}
                        </td>
                        <td className="font-extrabold py-4 pl-2 pr-3 text-sm text-gray-900 sm:pl-3">
                          {getGlobalGrade(result_element.history_data) == 0 && (
                            <>
                              <span
                                className={classNames(
                                  "inline-flex items-center rounded-full px-3 py-2 text-xs font-lg text-[#D92D20] ring-1 ring-inset ring-[#D92D20]"
                                )}
                              >
                                <span
                                  className={classNames(
                                    "w-[5px] h-[5px] rounded-full bg-[#D92D20] my-auto mr-1"
                                  )}
                                ></span>
                                <span className="my-auto">0/ 20</span>
                              </span>
                            </>
                          )}
                          {getGlobalGrade(result_element.history_data) > 0 &&
                            getGlobalGrade(result_element.history_data) <
                              20 && (
                              <>
                                <span
                                  className={classNames(
                                    "inline-flex items-center rounded-full px-3 py-2 text-xs font-lg text-[#FF9314] ring-1 ring-inset ring-[#FF9314]"
                                  )}
                                >
                                  <span
                                    className={classNames(
                                      "w-[5px] h-[5px] rounded-full bg-[#FF9314] my-auto mr-1"
                                    )}
                                  ></span>
                                  <span className="my-auto">
                                    {computeGlobalGrade(
                                      result_element.history_data
                                    )}
                                  </span>
                                </span>
                              </>
                            )}
                          {getGlobalGrade(result_element.history_data) ==
                            20 && (
                            <>
                              <span
                                className={classNames(
                                  "inline-flex items-center rounded-full px-3 py-2 text-xs font-lg text-[#067647] ring-1 ring-inset ring-[#067647]"
                                )}
                              >
                                <span
                                  className={classNames(
                                    "w-[5px] h-[5px] rounded-full bg-[#067647] my-auto mr-1"
                                  )}
                                ></span>
                                <span className="my-auto">20/ 20</span>
                              </span>
                            </>
                          )}
                        </td>
                        <td
                          onClick={() => viewExam(result_element.history_data)}
                        >
                          <span className="text-[#6941C6] font-semibold cursor-pointer">
                            View
                          </span>
                        </td>
                        <td onClick={() => retakeExam(result_element)}>
                          <span className="text-[#6941C6] font-semibold cursor-pointer">
                            Take
                          </span>
                        </td>
                        <td
                          onClick={() => {
                            if (result_element.favorite) {
                              setCurrentElement(result_element);
                              return;
                            }
                            toggleFavorite(result_element);
                          }}
                        >
                          <span className="text-[#6941C6] font-semibold cursor-pointer">
                            {result_element.favorite ? "UnFav" : "Fav"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ________________________________________________________________________ */}
          </div>
        </div>
      )}
      {currentElement && (
        <HistoryModal
          onCancel={() => currentElement(null)}
          onRemove={() => toggleFavorite(currentElement)}
        />
      )}
    </>
  );
}

export default AnnalesPage;
