import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import format from "date-fns/format";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import { useQuiz } from "../../hooks/useQuiz";
import Label from "../common/Label";
import ConfirmModal from "../common/ConfirmModal";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { Spinner } from "../icons/Spinner";
import { useAuth } from "../../providers/authProvider";

const QuestionItem = ({ question: _question, refresh = () => {} }) => {
  const {
    question_id,
    question,
    question_number,
    playlists,
    user_score,
    total_score,
    last_assess,
  } = _question;
  const { user } = useAuth();
  const authHttpClient = useAuthHttpClient();
  const navigator = useNavigate();
  const { selectedQuestions, setSelectedQuestions, loadQuestions } = useQuiz();
  const [openConfirmTestModal, setOpenConfirmTestModal] = useState();
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingTest, setIsLoadingTest] = useState(false);

  const checkHandle = (checked) => {
    const tempQuestions = [
      ...selectedQuestions.filter((_id) => question_id !== _id),
    ];
    if (checked) tempQuestions.push(question_id);
    setSelectedQuestions(tempQuestions);
  };

  const removePlaylist = async () => {
    setIsDeleting(true);
    try {
      const response = await authHttpClient.post(
        `/playlist/deleteQuestionFromPlaylist`,
        {
          user_id: user._id,
          question_id: question_id,
        }
      );
      console.log(response);
      setIsDeleting(false);
      refresh();
    } catch (error) {
      setIsDeleting(false);
      console.log(error);
    }
  };

  const testFromPlaylist = async () => {
    setIsLoadingTest(true);
    try {
      const response = await authHttpClient.get(`/question/${question_id}`);
      setIsLoadingTest(false);
      loadQuestions([response.data.data]);
      navigator("/quiz");
    } catch (error) {
      console.log(error);
      setIsLoadingTest(false);
    }
  };

  return (
    <>
      <tr key={question_id} className="even:bg-gray-50">
        <td className="whitespace-wrap font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 flex questions-center gap-2 items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            checked={!!selectedQuestions.find((_id) => question_id === _id)}
            onChange={(e) => {
              checkHandle(e.target.checked);
            }}
          />
          {question_number}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {last_assess && format(new Date(last_assess), "MMM dd, yyyy")}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex flex-wrap gap-1">
          {playlists && (
            <>
              {playlists
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((playlist) => (
                  <Label color={playlist.color}>{playlist.name}</Label>
                ))}
            </>
          )}
        </td>
        <td className="w-1/4 whitespace-nowrap px-3 py-4 text-sm text-gray-500 max-w-xs flex-auto truncate ">
          {question}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {user_score !== null &&
            user_score !== undefined &&
            `${user_score}/${total_score}`}
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <Link
            onClick={() => !isDeleting && setOpenConfirmDeleteModal(true)}
            className="text-primary-600 hover:text-primary-900"
          >
            {isDeleting ? (
              <Spinner small center />
            ) : (
              <TrashIcon className="w-5 h-5 stroke-2" />
            )}
          </Link>
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <Link
            onClick={() => !isLoadingTest && setOpenConfirmTestModal(true)}
            className="text-primary-600 hover:text-primary-900"
          >
            {isLoadingTest ? (
              <Spinner small center />
            ) : (
              <PencilSquareIcon className="w-5 h-5 stroke-2" />
            )}
          </Link>
        </td>
      </tr>
      <ConfirmModal
        open={openConfirmDeleteModal}
        setOpen={setOpenConfirmDeleteModal}
        content={`Do you want to delete this question from the playlist?`}
        onConfirm={() => {
          removePlaylist();
        }}
      />
      <ConfirmModal
        open={openConfirmTestModal}
        setOpen={setOpenConfirmTestModal}
        content={`Do you want to take the test from this playlist?`}
        onConfirm={() => {
          testFromPlaylist();
        }}
      />
    </>
  );
};

export default QuestionItem;
