import React, { useState } from "react";
import ExitIcon from "../icons/ExitIcon";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ExamResultSidebar({
  result,
  currentDp,
  setCurrentDp,
  currentQuestion,
  setCurrentQuestion,
  setDpOrQuestion,
  dpOrQuestion,
  closeSideBar,
}) {
  const navigator = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const clickHandle = () => {
    setOpenModal(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center text-white p-8 pb-4 font-bold text-lg">
        Exam Result
      </div>
      <div className="flex-1 overflow-auto">
        {result.dps.length > 0 &&
          result.dps.map((dp, dp_index) => (
            <div className="w-full">
              <div className="px-6 w-full text-white font-bold py-2 text-left">{`DP ${
                dp_index + 1
              }`}</div>
              <div className="px-8 py-2 flex-1 overflow-auto flex flex-col gap-1">
                {dp.questions.map((question, qi_index) => (
                  <div
                    onClick={() => {
                      document
                        .querySelector(
                          "#scrollspy-" +
                            dp_index.toString() +
                            qi_index.toString()
                        )
                        .scrollIntoView({
                          behavior: "smooth",
                        });
                    }}
                    className={classNames(
                      "text-primary-100 rounded-md py-1 hover:bg-primary-700 active:bg-primary-600 focus:bg-primary-600 click-action hover:cursor-pointer",
                      dp_index === currentDp &&
                        qi_index === currentQuestion &&
                        "bg-primary-700"
                    )}
                  >
                    <i
                      className={`ri-checkbox-blank-circle-fill px-2 ${
                        !question.userAnswer
                          ? "text-white"
                          : question.user_score > 15
                          ? "text-green-light"
                          : question.user_score > 3
                          ? "text-orange-light"
                          : "text-red-light"
                      }`}
                    ></i>
                    {`Question ${qi_index + 1}`}
                  </div>
                ))}
              </div>
            </div>
          ))}
        {result.questions.length > 0 && (
          <div className="w-full">
            <div className="px-6 w-full text-white font-bold py-2 text-left">
              QI
            </div>
            <div className="px-8 py-2 flex-1 overflow-auto flex flex-col gap-1">
              {result.questions.map((question, qi_index) => (
                <div
                  onClick={() => {
                    document
                      .querySelector("#scrollspy-" + qi_index.toString())
                      .scrollIntoView({
                        behavior: "smooth",
                      });
                  }}
                  className={classNames(
                    "text-primary-100 rounded-md py-1 hover:bg-primary-700 active:bg-primary-600 focus:bg-primary-600 click-action hover:cursor-pointer",
                    dpOrQuestion === "question" &&
                      qi_index === currentQuestion &&
                      "bg-primary-700"
                  )}
                >
                  <i
                    className={`ri-checkbox-blank-circle-fill px-2 ${
                      !question.userAnswer
                        ? "text-white"
                        : question.user_score > 15
                        ? "text-green-light"
                        : question.user_score > 3
                        ? "text-orange-light"
                        : "text-red-light"
                    }`}
                  ></i>
                  {`Question ${qi_index + 1}`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="text-center text-white p-8 flex">
        <div
          onClick={() => clickHandle()}
          className="flex-1 hover:cursor-pointer"
        >
          TERMINER
        </div>
        <button onClick={() => clickHandle()}>
          <ExitIcon />
        </button>
      </div>
      <ConfirmModal
        open={openModal}
        setOpen={setOpenModal}
        content={"Do you want to exit?"}
        onConfirm={() => {
          if (result.isPastExam) {
            navigator("/history");
            return;
          }
          navigator("/");
        }}
      />
    </div>
  );
}

export default ExamResultSidebar;
