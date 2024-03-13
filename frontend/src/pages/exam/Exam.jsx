import { useEffect, useState } from "react";
import ExamSidebar from "../../components/exam/ExamSidebar";
import QuestionCardSimple from "../../components/exam/QuestionCardSimple";
import { useNavigate } from "react-router-dom";
import { useExam } from "../../providers/examProvider";
import DpCardSimple from "../../components/exam/DpCardSimple";
import { Spinner } from "flowbite-react";
import ConfirmModal from "../../components/common/ConfirmModal";
import { format } from "date-fns";
import ExamHeader from "../../components/exam/ExamHeader";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useAuth } from "../../providers/authProvider";
import { HttpStatusCode } from "axios";

export default function ExamPage() {
  const navigator = useNavigate();
  const {
    questions,
    setQuestions,
    dps,
    setDps,
    submitAnswers,
    isSubmitting,
    setResumeSession,
  } = useExam();
  const [dpOrQuestion, setDpOrQuestion] = useState("dp"); // "dp" or "question"
  const [currentDp, setCurrentDp] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sidebarLeft, setSidebar] = useState(false);
  const [end, setEnd] = useState(false);
  const authHttpClient = useAuthHttpClient();
  const number_of_questions =
    dps.reduce((total, currentObj) => {
      return total + (currentObj.questions ? currentObj.questions.length : 0);
    }, 0) + questions.length;

  const progress =
    ((dps.reduce((total, currentObj) => {
      return (
        total +
        (currentObj.questions
          ? currentObj.questions.reduce((qTotal, qCurrent) => {
              return qTotal + (qCurrent.userAnswer ? 1 : 0);
            }, 0)
          : 0)
      );
    }, 0) +
      questions.reduce((qTotal, qCurrent) => {
        return qTotal + (qCurrent.userAnswer ? 1 : 0);
      }, 0)) *
      100) /
    number_of_questions;
  useEffect(() => {
    end && submitAnswers();
  }, [end]);

  const { user } = useAuth();
  const setAnswer = (answer) => {
    const tempQuestions = [...questions];
    tempQuestions[currentQuestion].result = { choices: [] };
    tempQuestions[currentQuestion].userAnswer = answer;
    for (let ans of answer) {
      tempQuestions[currentQuestion].result.choices.push({ yourAnswer: ans });
    }
    setQuestions(tempQuestions);
  };
  const next = (answer) => {
    setAnswer(answer);
    const tempQuestions = JSON.parse(JSON.stringify(questions));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (dps.length > 0 || questions.length > 0) {
      if (dps.length === 0) setDpOrQuestion("question");
    } else {
      navigator(-1);
    }
  }, [questions, dps, currentDp, currentQuestion, navigator]);

  const saveExam = async () => {
    const payload = {
      user_id: user._id,
      exam_data: {
        questions,
        dps,
      },
      is_exam: true,
    };
    const response = await authHttpClient.post(`/history/saveExam`, payload);

    if (!response.status == HttpStatusCode.Ok) {
      alert("Something went wrong when saving the progress");
      return;
    }

    setResumeSession(payload);
    navigator(-1);
  };
  if ((questions.length < 1 && dps.length < 1) || (!dps && !questions))
    return null;

  return (
    <div className="overflow-x-hidden">
      <ExamHeader
        progress={progress}
        setOpenModal={setOpenModal}
        isSubmitting={isSubmitting}
      />
      <div className="flex flex-col h-[100vh-100px]">
        <div className="relative flex-1">
          <div
            className={`${
              sidebarLeft ? "lg:left-0" : "lg:right-0"
            } lg:w-72 hidden bg-white lg:absolute lg:inset-y-0 lg:z-2 lg:flex lg:flex-col`}
          >
            <ExamSidebar
              isSubmitting={isSubmitting}
              dps={dps}
              questions={questions}
              dpOrQuestion={dpOrQuestion}
              setDpOrQuestion={setDpOrQuestion}
              currentDp={currentDp}
              setCurrentDp={setCurrentDp}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              setEnd={setEnd}
              sidebarLeft={sidebarLeft}
              setSidebar={setSidebar}
            />
          </div>
          <div
            className={`${
              sidebarLeft ? "lg:pl-72" : "lg:pr-72"
            } h-[calc(100vh-100px)] overflow-auto`}
          >
            {dpOrQuestion === "dp" && dps?.length && (
              <DpCardSimple
                dps={dps}
                setDps={setDps}
                currentDp={currentDp}
                setCurrentDp={setCurrentDp}
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
              />
            )}
            {dpOrQuestion === "question" && questions?.length && (
              <QuestionCardSimple
                question={questions[currentQuestion]}
                answer={questions[currentQuestion]?.userAnswer}
                currentQuestion={currentQuestion}
                next={next}
              />
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-[25px] right-[50px] m-4">
        <div className="with-tooltip relative flex items-center justify-center">
          <button
            className=" w-[4rem] h-[4rem] bg-black text-white rounded transition duration-300 rounded-full"
            onClick={saveExam}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
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

      <ConfirmModal
        open={openModal}
        setOpen={setOpenModal}
        content={"Do you want to finish the exam?"}
        onConfirm={() => {
          setEnd(true);
        }}
      />
    </div>
  );
}
