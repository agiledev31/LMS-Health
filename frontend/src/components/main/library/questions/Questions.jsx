import { Link } from "react-router-dom";
import Search from "../../Search";
import Filter from "../../Filter";
import {
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import useAuthHttpClient from "../../../../hooks/useAuthHttpClient";
import { useAuth } from "../../../../providers/authProvider";
import Modal from "../../../common/Modal";
import { Spinner } from "../../../icons/Spinner";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox, Switch } from "@headlessui/react";
import { useQuiz } from "../../../../hooks/useQuiz";
import { useData } from "../../../../providers/learningDataProvider";
import SearchField from "../../SearchField";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Questions() {
  const { setOpenTakeTestModal } = useQuiz();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { matieres, items, tags, sessions, cards } = useData();
  const authHttpClient = useAuthHttpClient();
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await authHttpClient.get("/question");
        setQuestions(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchQuestions();
  }, []);

  const createQuestion = () => {
    var win = window.open("/addQuestion/", "_blank");
    win.focus();
  };

  const editQuestion = (id) => {
    var win = window.open(`/editQuestion/${id}`, "_blank");
    win.focus();
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      {user.role === "admin" && (
        <>
          <div className="inline-block min-w-full align-middle">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  createQuestion();
                  // setOpenNewQuestionModal(true);
                }}
                className="click-action inline-flex justify-between border-2 border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
              >
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Add New Question
              </button>
              <div className="flex items-center space-x-2">
                <SearchField searchText={searchText} setSearchText={setSearchText} />
              </div>
            </div>
            <table className="my-4 min-w-full divide-y divide-gray-300 rounded-lg border-2 border-gray-400">
              <thead className="divide-y divide-gray-200 bg-white rounded">
                <tr>
                  <th
                    scope="col"
                    className="min-w-[80px] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 flex items-center gap-2"
                  >
                    <div>ID</div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Question
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Matiere
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Session
                  </th>
                  {/* <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Tags
                  </th> */}
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Delete</span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Test</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {questions.map((question) => (
                  <tr key={question._id} className="even:bg-gray-50">
                    <td className="font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 gap-2">
                      {question.question_number}
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500 w-1/4 whitespace-nowrap  max-w-xs flex-auto truncate ">
                      {question.question}
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500">
                      {
                        matieres.find(({ _id }) => _id === question.matiere_id)
                          ?.name
                      }
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500">
                      {question.item_id &&
                        `${
                          items.find(({ _id }) => _id === question.item_id)
                            ?.item_number
                        }. ${
                          items.find(({ _id }) => _id === question.item_id)
                            ?.name
                        }`}
                    </td>
                    <td className=" px-3 py-1 text-sm text-gray-500">
                      <div className="flex flex-wrap">
                        {question.session_id &&
                          <div
                            key={question.session_id}
                            className="px-2 m-1 max-w-fit border border-gray-400 rounded-md text-[12px]"
                          >
                            {sessions.find(({ _id }) => _id === question.session_id)?.name}
                          </div>
                        }
                      </div>
                    </td>
                    {/* <td className=" px-3 py-1 text-sm text-gray-500 ">
                      <div className="flex flex-wrap">
                        {question.tags.map((tag) => (
                          <div
                            key={tag._id}
                            className="px-2 m-1 max-w-fit border border-gray-400 rounded-md text-[12px]"
                          >
                            {tag.name}
                          </div>
                        ))}
                      </div>
                    </td> */}
                    <td className="relative  py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        href="#"
                        onClick={() => {
                          setSelectedQuestion(question);
                          setOpenDeleteConfirmModal(true);
                        }}
                        className="text-red-600 hover:text-primary-900"
                      >
                        <TrashIcon className="w-5 h-5 stroke-2" />
                      </Link>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        onClick={() => editQuestion(question._id)}
                        // to={`/editQuestion/${question._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilSquareIcon className="w-5 h-5 stroke-2" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DeleteConformModal />
        </>
      )}
    </div>
  );

  function DeleteConformModal() {
    const [deleting, setDeleting] = useState(false);
    const handleSubmit = async (e) => {
      setDeleting(true);
      try {
        await authHttpClient.delete(`/question/${selectedQuestion._id}`);
        setDeleting(false);
        setOpenDeleteConfirmModal(false);
        setQuestions((questions) => {
          return questions.filter((item) => item._id !== selectedQuestion._id);
        });
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <Modal open={openDeleteConfirmModal} setOpen={setOpenDeleteConfirmModal}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[400px]">
          <label
            htmlFor="matiere"
            className="block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Do you really want to delete this question?
          </label>
          <div className="mt-4 flex flex-row-reverse">
            <button
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-red-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {deleting && <Spinner small />} Delete
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
