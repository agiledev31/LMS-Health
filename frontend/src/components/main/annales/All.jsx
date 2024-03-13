import React, { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

import { useAuth } from "../../../providers/authProvider";
import useAuthHttpClient from "../../../hooks/useAuthHttpClient";

import Pagination from "../Pagination";
import Search from "../Search";
import Filter from "./Filter";
import DPItem from "../DPItem";
import { Spinner } from "../../icons/Spinner";
import { Switch } from "@headlessui/react";
import SearchField from "../SearchField";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function All() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const authHttpClient = useAuthHttpClient();
  const [dps, setDps] = useState([]);
  const [qis, setQis] = useState([]);

  const [showDp, setShowDp] = useState(true);
  const [showQi, setShowQi] = useState(true);
  const [totalNumber, setTotalNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState({ matieres: [], items: [], tags: [] });
  const [sort, setSort] = useState({ dp_number: 1, question_number: 1 });
  const [hideMatieres, setHideMatieres] = useState(true);
  const [hideItems, setHideItems] = useState(true);
  const [elements, setElements] = useState([]);
  useEffect(() => {
    const fetchElements = async () => {
      let res = [];
      let res_total_number = 0;

      if (!showDp && !showQi) {
        setIsLoading(false);
        setElements([]);
        setTotalNumber(0);
        return;
      }

      try {
        const response = await authHttpClient.post("/annales/getPage", {
          user_id: user._id,
          pageSize,
          pageNumber,
          searchText,
          filter,
          sort,
          show_dp: showDp,
          show_qi: showQi,
        });
        res.push(
          ...response.data.data.map((x) => {
            let aux = x;
            aux.isQuestion = false;
            if (x.question) {
              aux.isQuestion = true;
            }
            return aux;
          })
        );
        res_total_number += response.data.total_number;
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
      setElements(res);
      setTotalNumber(res_total_number);
    };

    fetchElements();
  }, [searchText, pageNumber, pageSize, sort, filter, showDp, showQi]);

  const sortByDPId = () => {
    // let tempSort = { ...sort };
    // if (showDp) {
    //   delete tempSort.dp_number;
    //   if (sort.dp_number === 1) tempSort = { dp_number: -1, ...tempSort };
    //   else if (sort.dp_number === -1) tempSort = { dp_number: 1, ...tempSort };
    // } else {
    //   delete tempSort.question_number;
    //   if (sort.question_number === 1)
    //     tempSort = { question_number: -1, ...tempSort };
    //   else if (sort.question_number === -1)
    //     tempSort = { question_number: 1, ...tempSort };
    // }
    // setSort(tempSort);
  };

  const sortByLastAssess = () => {
    let tempSort = { ...sort };
    delete tempSort.last_assess;
    if (!sort?.last_assess) tempSort = { last_assess: 1, ...tempSort };
    else if (sort.last_assess === 1)
      tempSort = { last_assess: -1, ...tempSort };
    setSort(tempSort);
  };

  const sortByScore = () => {
    let tempSort = { ...sort };
    delete tempSort.user_score;
    if (!sort?.user_score) tempSort = { user_score: 1, ...tempSort };
    else if (sort.user_score === 1) tempSort = { user_score: -1, ...tempSort };
    setSort(tempSort);
  };

  return (
    <div>
      {isLoading ? (
        <div
          role="status"
          className="h-[70vh] pb-20 flex justify-center items-center"
        >
          <Spinner />
        </div>
      ) : (
        <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg  divide-y-2 divide-gray-200">
          <div className="p-4 bg-white flex justify-between sm:rounded-t-lg gap-2">
            <SearchField
              searchText={searchText}
              setSearchText={setSearchText}
            />
            <div className="flex gap-2 items-center justify-center">
              <div className="flex gap-2 items-center justify-between">
                <div class="relative flex items-start">
                  <div class="flex h-6 items-center">
                    <input
                      id="dps"
                      aria-describedby="dps-description"
                      name="dps"
                      type="checkbox"
                      checked={showDp}
                      onChange={() => setShowDp(!showDp)}
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>

                  <div class="ml-3 text-sm leading-6">
                    <label for="dps" class="font-medium text-gray-900">
                      DPs
                    </label>
                  </div>
                </div>
                <div class="relative flex items-start mr-5">
                  <div class="flex h-6 items-center">
                    <input
                      id="qi"
                      aria-describedby="qi-description"
                      name="qi"
                      type="checkbox"
                      checked={showQi}
                      onChange={() => {
                        setShowQi(!showQi);
                      }}
                      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>

                  <div class="ml-3 text-sm leading-6">
                    <label for="comments" class="font-medium text-gray-900">
                      QIs
                    </label>
                  </div>
                </div>
              </div>
              <Filter filter={filter} setFilter={setFilter} />
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="divide-y divide-gray-200 bg-white rounded">
              <tr>
                <th
                  scope="col"
                  className="min-w-[80px] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 flex items-center gap-2"
                >
                  <div
                    onClick={() => {
                      sortByDPId();
                    }}
                    className="hover:cursor-pointer hover:text-primary-600 flex items-center max-w-fit"
                  >
                    ID
                    {sort.dp_number && sort.dp_number === 1 && (
                      <ChevronDownIcon className="w-4 h-4 stroke-2" />
                    )}
                    {sort.dp_number && sort.dp_number === -1 && (
                      <ChevronUpIcon className="w-4 h-4 stroke-2" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[150px]"
                >
                  <div
                    onClick={() => {
                      sortByLastAssess();
                    }}
                    className="hover:cursor-pointer hover:text-primary-600 flex items-center"
                  >
                    Last assessed
                    {!sort.last_assess && (
                      <ChevronUpDownIcon className="w-4 h-4 stroke-2" />
                    )}
                    {sort.last_assess && sort.last_assess === 1 && (
                      <ChevronDownIcon className="w-4 h-4 stroke-2" />
                    )}
                    {sort.last_assess && sort.last_assess === -1 && (
                      <ChevronUpIcon className="w-4 h-4 stroke-2" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[200px] flex"
                  onClick={() => setHideMatieres(!hideMatieres)}
                >
                  <span>Matiere</span>
                  <div className="my-auto mx-2">
                    {!hideMatieres ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  onClick={() => setHideItems(!hideItems)}
                >
                  <div className="flex">
                    <span>Item</span>
                    <div className="my-auto mx-2">
                      {!hideItems ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-4 h-4"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </th>

                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 w-[150px]"
                >
                  <div
                    onClick={() => {
                      sortByScore();
                    }}
                    className="hover:cursor-pointer hover:text-primary-600 flex items-center max-w-fit"
                  >
                    Last score
                    {!sort.user_score && (
                      <ChevronUpDownIcon className="w-4 h-4 stroke-2" />
                    )}
                    {sort.user_score && sort.user_score === 1 && (
                      <ChevronDownIcon className="w-4 h-4 stroke-2" />
                    )}
                    {sort.user_score && sort.user_score === -1 && (
                      <ChevronUpIcon className="w-4 h-4 stroke-2" />
                    )}
                  </div>
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Test</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {elements.map((el) => (
                <DPItem
                  key={el._id}
                  dp={el}
                  isQuestion={el.isQuestion}
                  hideMatieres={hideMatieres}
                  hideItems={hideItems}
                />
              ))}
            </tbody>
          </table>
          <Pagination
            totalNumber={totalNumber}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </div>
      )}
    </div>
  );
}

export default All;
