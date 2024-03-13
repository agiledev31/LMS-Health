import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Sidebar from "../../components/exam/Sidebar";
import QuestionCard from "../../components/exam/QuestionCard";
import { useQuiz } from "../../hooks/useQuiz";
import { useNavigate } from "react-router-dom";
import { useExam } from "../../providers/examProvider";
import { useAuth } from "../../providers/authProvider";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { HttpStatusCode } from "axios";

export default function TestPage() {
  const { questions, setQuestions } = useQuiz();
  const [currentQuestion, setQuestion] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigator = useNavigate();
  const examContext = useExam();
  const { user } = useAuth();
  const authHttpClient = useAuthHttpClient();

  console.log(currentQuestion);
  console.log(questions);
  useEffect(() => {
    if (questions.length < 1) {
      navigator(-1);
      return;
    }
  }, []);

  const saveQuiz = async () => {
    const payload = {
      user_id: user._id,
      exam_data: {
        questions,
      },
      is_exam: false,
    };
    const response = await authHttpClient.post(`/history/saveExam`, payload);

    if (!response.status == HttpStatusCode.Ok) {
      alert("Something went wrong when saving the progress");
      return;
    }
    examContext.setResumeSession(payload);
    navigator(-1);
  };

  if (questions.length < 1) return null;
  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex flex-row-reverse">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute right-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="w-full bg-[#53389E] h-screen">
                    <Sidebar
                      currentQuestion={currentQuestion}
                      setQuestion={setQuestion}
                      questions={questions}
                      closeSideBar={() => setSidebarOpen(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden bg-[#53389E] lg:absolute lg:right-0 lg:inset-y-0 lg:z-2 lg:flex lg:w-72 lg:flex-col">
          <Sidebar
            currentQuestion={currentQuestion}
            setQuestion={setQuestion}
            questions={questions}
          />
        </div>
        <button
          type="button"
          className="absolute top-5 right-7 rounded-lg bg-primary-600 opacity-50 hover:opacity-100 text-white -m-2.5 p-2.5 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="lg:pr-72">
          <QuestionCard
            question={questions[currentQuestion]}
            setQuestions={setQuestions}
            index={currentQuestion}
            next={() => {
              setQuestion((state) => {
                if (state + 1 >= questions.length) {
                  examContext.submitAnswers([], questions);
                }
                return state + 1 < questions.length ? state + 1 : state;
              });
            }}
          />
          <div className="fixed bottom-[20px] right-72 m-4">
            <div className="with-tooltip relative flex items-center justify-center">
              <button
                className=" w-[3rem] h-[3rem] bg-black text-white rounded transition duration-300 rounded-full"
                onClick={saveQuiz}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 35 35"
                  fill="none"
                  className="m-auto"
                >
                  <path
                    d="M10.717 5.13207V9.87924C10.717 10.6612 10.717 11.0522 10.8692 11.3509C11.003 11.6136 11.2166 11.8272 11.4793 11.961C11.778 12.1132 12.169 12.1132 12.9509 12.1132H22.4453C23.2272 12.1132 23.6182 12.1132 23.9169 11.961C24.1796 11.8272 24.3932 11.6136 24.5271 11.3509C24.6792 11.0522 24.6792 10.6612 24.6792 9.87924V6.5283M24.6792 30.2641V21.3283C24.6792 20.5463 24.6792 20.1554 24.5271 19.8567C24.3932 19.594 24.1796 19.3804 23.9169 19.2465C23.6182 19.0943 23.2272 19.0943 22.4453 19.0943H12.9509C12.169 19.0943 11.778 19.0943 11.4793 19.2465C11.2166 19.3804 11.003 19.594 10.8692 19.8567C10.717 20.1554 10.717 20.5463 10.717 21.3283V30.2641M30.2641 13.9639V23.5623C30.2641 25.9081 30.2641 27.0811 29.8076 27.9771C29.406 28.7652 28.7652 29.406 27.9771 29.8076C27.0811 30.2641 25.9081 30.2641 23.5623 30.2641H11.834C9.48808 30.2641 8.31514 30.2641 7.41913 29.8076C6.63098 29.406 5.9902 28.7652 5.58861 27.9771C5.13207 27.0811 5.13207 25.9081 5.13207 23.5623V11.834C5.13207 9.48808 5.13207 8.31514 5.58861 7.41913C5.9902 6.63098 6.63098 5.9902 7.41913 5.58861C8.31514 5.13207 9.48808 5.13207 11.834 5.13207H21.4323C22.1154 5.13207 22.4569 5.13207 22.7782 5.20923C23.0632 5.27764 23.3356 5.39046 23.5854 5.54357C23.8672 5.71626 24.1087 5.95774 24.5916 6.4407L28.9555 10.8046C29.4385 11.2875 29.68 11.529 29.8527 11.8108C30.0058 12.0607 30.1186 12.3331 30.187 12.618C30.2642 12.9394 30.2641 13.2809 30.2641 13.9639Z"
                    stroke="white"
                    stroke-width="2.79245"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <span className="tooltip-text absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs p-2 rounded shadow-lg w-[140px] text-center">
                Save to resume later
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
