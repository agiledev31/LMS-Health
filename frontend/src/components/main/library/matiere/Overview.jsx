import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  EllipsisVerticalIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

import PieChart from "../../PieChart";
import Search from "../../Search";
import { ProgressBar } from "../../../common/ProgressBar";
import Pagination from "../../Pagination";
import { Spinner } from "../../../icons/Spinner";
import useAuthHttpClient from "../../../../hooks/useAuthHttpClient";
import { useAuth } from "../../../../providers/authProvider";
import { useQuiz } from "../../../../hooks/useQuiz";
import { ItemStatus } from "../../ItemStatus";
import { Popover, Transition } from "@headlessui/react";
import SearchField from "../../SearchField";

function Overview({ matiere }) {
  const { user } = useAuth();
  const { setSelectedMatiere, setSelectedItem, setOpenTakeTestModal } =
    useQuiz();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authHttpClient = useAuthHttpClient();

  const [totalNumber, setTotalNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});

  useEffect(() => {
    if (!matiere) return;
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await authHttpClient.post(`/item/getPage`, {
          user_id: user._id,
          pageSize,
          pageNumber,
          searchText,
          filter: { ...filter, matiere_id: matiere._id },
          sort,
        });
        setTotalNumber(response.data.total_number);
        setItems(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, [pageSize, pageNumber, searchText, filter, sort, matiere]);

  const filterByStatus = (status) => {
    setFilter({ status: status });
  };

  const sortByNQuestion = () => {
    let tempSort = { ...sort };
    delete tempSort.n_questions;
    if (!sort?.n_questions) tempSort = { n_questions: 1, ...tempSort };
    else if (sort.n_questions === 1)
      tempSort = { n_questions: -1, ...tempSort };
    setSort(tempSort);
  };

  const sortByProgress = () => {
    let tempSort = { ...sort };
    delete tempSort.progress;
    if (!sort?.progress) tempSort = { progress: 1, ...tempSort };
    else if (sort.progress === 1) tempSort = { progress: -1, ...tempSort };
    setSort(tempSort);
  };

  return (
    <>
      <div className="inline-block min-w-full py-2 align-middle">
        <div className="overflow shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg  divide-y-2 divide-gray-200">
          <div className="px-6 py-4 bg-white text-xl font-extrabold flex justify-between items-center">
            Liste des items
            <SearchField
              searchText={searchText}
              setSearchText={setSearchText}
            />
          </div>
          {/* <div className="p-4 bg-white flex justify-between">
          </div> */}

          <table className="min-w-full divide-y divide-gray-300">
            <thead className="divide-y divide-gray-200 bg-white">
              <tr>
                <th
                  scope="col"
                  className="w-1/3 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  <ItemStatusFilter
                    setStatus={filterByStatus}
                    status={filter.status}
                  />
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  <div
                    onClick={() => {
                      sortByNQuestion();
                    }}
                    className="hover:cursor-pointer hover:text-primary-600 flex items-center max-w-fit"
                  >
                    Number of questions
                    {!sort.n_questions && (
                      <ChevronUpDownIcon className="w-4 h-4 stroke-2" />
                    )}
                    {sort.n_questions && sort.n_questions === 1 && (
                      <ChevronDownIcon className="w-4 h-4 stroke-2" />
                    )}
                    {sort.n_questions && sort.n_questions === -1 && (
                      <ChevronUpIcon className="w-4 h-4 stroke-2" />
                    )}
                  </div>
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  <div
                    onClick={() => {
                      sortByProgress();
                    }}
                    className="hover:cursor-pointer hover:text-primary-600 flex items-center max-w-fit"
                  >
                    Progress rate
                    {!sort.progress && (
                      <ChevronUpDownIcon className="w-4 h-4 stroke-2" />
                    )}
                    {sort.progress && sort.progress === 1 && (
                      <ChevronDownIcon className="w-4 h-4 stroke-2" />
                    )}
                    {sort.progress && sort.progress === -1 && (
                      <ChevronUpIcon className="w-4 h-4 stroke-2" />
                    )}
                  </div>
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            {!isLoading && (
              <tbody className="divide-y divide-gray-200 bg-white">
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="whitespace-wrap font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 hover:text-primary-600 hover:cursor-pointer click-action">
                      <Link to={`/library/item/${item._id}`}>
                        {item.item_number}. {item.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <ItemStatus
                        status={item.status}
                        status_id={item.status_id}
                        setItems={setItems}
                        item_id={item._id}
                        itemIndex={index}
                      />
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {item.n_questions} questions
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <ProgressBar
                        progress={
                          item.n_questions && item.progress
                            ? Math.round(
                                (item.progress / item.n_questions) * 100
                              )
                            : 0
                        }
                      />
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        // to="/quiz"
                        onClick={() => {
                          setSelectedItem(item._id);
                          setSelectedMatiere(matiere._id);
                          setOpenTakeTestModal(true);
                        }}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilSquareIcon className="w-5 h-5 stroke-2" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {isLoading && (
            <div className="h-[70vh] bg-white flex justify-center items-center">
              <Spinner />
            </div>
          )}
          <Pagination
            totalNumber={totalNumber}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </div>
      </div>
      <div className="mt-8 grid md:grid-cols-2 gap-8 bg-gray-50">
        {/* statistics card */}
        <StatisticsChart matiere={matiere} />
      </div>
    </>
  );
}

export const ItemStatusFilter = ({ status, setStatus }) => {
  const options = [
    {
      value: "done",
      label: "Fait",
    },
    {
      value: "todo",
      label: "À faire",
    },
    {
      value: "in progress",
      label: "En cours",
    },
    {
      value: null,
      label: "Pas de statut",
    },
    {
      value: undefined,
      label: "All",
    },
  ];
  return (
    <Popover as="div" className="relative w-full inline-block text-left">
      <Popover.Button className="hover:text-primary-600">Status</Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="space-y-1">
            {options.map((option, optionIdx) => (
              <div
                key={option.label}
                className={`flex items-center rounded-md py-1 hover:bg-gray-100 hover:cursor-pointer ${
                  option.value === status && "text-primary-600 bg-gray-100"
                }`}
                onClick={() => {
                  setStatus(option.value);
                }}
              >
                <span
                  className={`ml-3 whitespace-nowrap pr-6 text-sm font-extrabold`}
                >
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
const StatisticsChart = ({ matiere }) => {
  const [successRate, setSuccessRate] = useState(null);
  const [progressRate, setProgressRate] = useState(0);

  const authHttpClient = useAuthHttpClient();
  const { user } = useAuth();
  useEffect(() => {
    const getSuccessRate = async () => {
      try {
        const response = await authHttpClient.post(`/progress/matiere/filter`, {
          user_id: user._id,
          matiere_id: matiere._id,
        });
        setSuccessRate(response.data.data[0]?.success_rate);
        setProgressRate(response.data.data[0]?.progress_rate);
      } catch (error) {
        console.log(error);
      }
    };
    getSuccessRate();
  }, [user, matiere]);

  return (
    <>
      <div className="rounded-2xl bg-white p-6 relative">
        <div className="absolute top-4 right-4 text-gray-500 hover:cursor-pointer group-hover:text-primary-600">
          <EllipsisVerticalIcon className="w-6 h-6" />
        </div>
        <div>
          <PieChart
            data={
              successRate
                ? [
                    successRate.excellent,
                    successRate.good,
                    successRate.average,
                    successRate.poor,
                  ]
                : [0, 0, 0, 1]
            }
            color={["#7F56D9", "#9E77ED", "#B692F6", "#D6BBFB", "#EAECF0"]}
          />
        </div>
        <div className="py-4">How you answer?</div>
        <div className="text-green-500 text-4xl font-extrabold">
          {successRate
            ? Math.round(
                ((successRate.excellent + successRate.good) * 100) /
                  (successRate.excellent +
                    successRate.good +
                    successRate.average +
                    successRate.poor)
              )
            : 0}
          % success
        </div>
      </div>
      <div className="rounded-2xl bg-white p-6 relative">
        <div className="absolute top-4 right-4 text-gray-500 hover:cursor-pointer group-hover:text-primary-600">
          <EllipsisVerticalIcon className="w-6 h-6" />
        </div>
        <div>
          <PieChart
            data={
              progressRate
                ? [progressRate, matiere.n_questions - progressRate]
                : [0, 1]
            }
            color={["#475467", "#F2F4F7"]}
          />
        </div>
        <div className="py-4">Progress rate</div>
        <div className="text-green-500 text-4xl font-extrabold">
          {progressRate && matiere.n_questions
            ? Math.round((progressRate * 100) / matiere.n_questions)
            : 0}
          % done
        </div>
      </div>
    </>
  );
};

export default Overview;
