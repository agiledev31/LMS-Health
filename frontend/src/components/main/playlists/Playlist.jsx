import React, { useEffect, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

import useAuthHttpClient from "../../../hooks/useAuthHttpClient";
import { useAuth } from "../../../providers/authProvider";

import Pagination from "../Pagination";
import Label from "../../common/Label";
import { Spinner } from "../../icons/Spinner";
import QuestionItem from "../QuestionItem";
import { useQuiz } from "../../../hooks/useQuiz";
import { useNavigate } from "react-router-dom";

function Playlist({ playlist }) {
  const { user } = useAuth();
  const authHttpClient = useAuthHttpClient();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [show, setShow] = useState(false);

  const [totalNumber, setTotalNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [sort, setSort] = useState({ question_number: 1 });

  const { loadQuestions } = useQuiz();

  const navigator = useNavigate();

  const sortByScore = () => {
    let tempSort = { ...sort };
    delete tempSort.user_score;
    if (!sort?.user_score) tempSort = { user_score: 1, ...tempSort };
    else if (sort.user_score === 1) tempSort = { user_score: -1, ...tempSort };
    setSort(tempSort);
  };

  const sortByLastAssess = () => {
    let tempSort = { ...sort };
    delete tempSort.last_assess;
    if (!sort?.last_assess) tempSort = { last_assess: 1, ...tempSort };
    else if (sort.last_assess === 1)
      tempSort = { last_assess: -1, ...tempSort };
    setSort(tempSort);
  };

  const sortByQuestion = () => {
    let tempSort = { ...sort };
    delete tempSort.question;
    if (!sort?.question) tempSort = { question: 1, ...tempSort };
    else if (sort.question === 1) tempSort = { question: -1, ...tempSort };
    setSort(tempSort);
  };

  const sortByQuestionNumber = () => {
    let tempSort = { ...sort };
    delete tempSort.question_number;
    if (sort.question_number === 1)
      tempSort = { question_number: -1, ...tempSort };
    else if (sort.question_number === -1)
      tempSort = { question_number: 1, ...tempSort };
    setSort(tempSort);
  };

  const fetchQuestions = async () => {
    try {
      const response = await authHttpClient.post(`/playlist/getPage`, {
        user_id: user._id,
        playlist_id: playlist._id,
        pageNumber: pageNumber,
        pageSize: pageSize,
        sort,
      });
      setTotalNumber(response.data.total_number);
      setQuestions(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fullTraining = async () => {
    setIsLoading(true);
    const tempQuestions = [];

    for (let i = 0; i < questions.length; i++) {
      const response = await authHttpClient.get(
        `/question/${questions[i].question_id}`
      );
      tempQuestions.push(response.data.data);
    }
    setIsLoading(false);
    loadQuestions(tempQuestions);
    navigator("/quiz");
  };

  useEffect(() => {
    fetchQuestions();
  }, [pageSize, pageNumber, sort]);

  return (
    <>
      {isLoading ? (
        <div
          role="status"
          className="h-[70vh] pb-20 flex justify-center items-center"
        >
          <Spinner />
        </div>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg  divide-y-2 divide-gray-200">
          <div className="p-4 bg-white flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Label color={playlist.color}>{playlist.name}</Label>
              <div className="px-2 border-2 border-gray-400 rounded-md text-[12px] h-fit text-gray-700 font-semibold">
                {questions.length} questions
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={fullTraining}
                type="button"
                className="rounded-md bg-[#E9D7FE] px-2.5 py-2 w-[85%] text-[13px] mr-5 font-semibold text-white shadow-sm hover:bg-primary-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E9D7FE] border-[3px] border-primary-300 "
                style={{ color: "#6941C6" }}
              >
                Full training
              </button>
              {questions.length > 0 &&
                (show ? (
                  <ChevronUpIcon
                    onClick={() => setShow((state) => !state)}
                    className="w-5 h-5 stroke-2 hover:cursor-pointer hover:text-primary-600"
                  />
                ) : (
                  <ChevronDownIcon
                    onClick={() => setShow((state) => !state)}
                    className="w-5 h-5 stroke-2 hover:cursor-pointer hover:text-primary-600"
                  />
                ))}
              <EllipsisVerticalIcon className="w-5 h-5 stroke-2" />
            </div>
          </div>
          {show && questions.length > 0 && (
            <>
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 flex items-center gap-2"
                    >
                      <div
                        onClick={() => {
                          sortByQuestionNumber();
                        }}
                        className="hover:cursor-pointer hover:text-primary-600 flex items-center max-w-fit"
                      >
                        Question ID
                        {sort.question_number && sort.question_number === 1 && (
                          <ChevronDownIcon className="w-4 h-4 stroke-2" />
                        )}
                        {sort.question_number &&
                          sort.question_number === -1 && (
                            <ChevronUpIcon className="w-4 h-4 stroke-2" />
                          )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <div
                        onClick={() => {
                          sortByLastAssess();
                        }}
                        className="hover:cursor-pointer hover:text-primary-600 flex items-center max-w-fit"
                      >
                        Last Assessed
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
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Playlist
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      <div
                        onClick={() => {
                          sortByQuestion();
                        }}
                        className="hover:cursor-pointer hover:text-primary-600 flex items-center max-w-fit"
                      >
                        Description
                        {!sort.question && (
                          <ChevronUpDownIcon className="w-4 h-4 stroke-2" />
                        )}
                        {sort.question && sort.question === 1 && (
                          <ChevronDownIcon className="w-4 h-4 stroke-2" />
                        )}
                        {sort.question && sort.question === -1 && (
                          <ChevronUpIcon className="w-4 h-4 stroke-2" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Delete</span>
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Test</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {questions.map((question) => (
                    <QuestionItem
                      question={question}
                      key={question.question_id}
                      refresh={fetchQuestions}
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
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Playlist;
