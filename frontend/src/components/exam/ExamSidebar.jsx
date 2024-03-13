import React, { useEffect, useState } from "react";
import ExitIcon from "../icons/ExitIcon";
import { useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
import { format } from "date-fns";
import { Spinner } from "../icons/Spinner";
import ConfirmModal from "../common/ConfirmModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function ExamSidebar({
  isSubmitting,
  dps,
  questions,
  dpOrQuestion,
  setDpOrQuestion,
  currentDp,
  setCurrentDp,
  currentQuestion,
  setCurrentQuestion,
  setEnd,
  sidebarLeft,
  setSidebar,
}) {
  const navigator = useNavigate();
  const [totalTime, setTotalTime] = useState(1000);
  const [timeLeft, setTimeLeft] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
      <div className="bg-white text-center font-extrabold p-8 pb-4">
        <div className="mt-2 flex justify-center gap-5 mb-5">
          <span className="font-normal">Left</span>
          <Switch
            checked={sidebarLeft}
            onChange={() => setSidebar((_) => !_)}
            className="bg-[#203772] relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#203772] focus:ring-offset-2"
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={classNames(
                sidebarLeft ? "translate-x-0" : "translate-x-5",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
          <span className="font-normal">Right</span>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {dps.map((dp, dp_index) => (
          <div key={dp_index} className="w-full">
            <div className="w-full bg-[#203772] text-white font-bold py-4 text-center">{`DP ${
              dp_index + 1
            }`}</div>
            <div className="px-8 py-4 grid grid-cols-4 gap-4">
              {dp.questions.map((question, qi_index) => (
                <div
                  key={question._id}
                  onClick={() => {
                    if (
                      question.userAnswer ||
                      qi_index === 0 ||
                      dp.questions[qi_index - 1].userAnswer
                    ) {
                      setDpOrQuestion("dp");
                      setCurrentDp(dp_index);
                      setCurrentQuestion(qi_index);
                    }
                  }}
                  className={classNames(
                    "w-12 h-12 flex justify-center items-center click-action hover:cursor-pointer",
                    question.userAnswer
                      ? "bg-[#203772] text-white font-bold"
                      : "bg-gray-200",
                    dpOrQuestion === "dp" &&
                      dp_index === currentDp &&
                      qi_index === currentQuestion &&
                      "border-2 border-[#203772]"
                  )}
                >
                  {qi_index + 1}
                </div>
              ))}
            </div>
          </div>
        ))}
        {questions.length > 0 && (
          <div className="w-full">
            <div className="w-full bg-[#203772] text-white font-bold py-4 text-center">
              QI
            </div>
            <div className="px-8 py-4 grid grid-cols-4 gap-4">
              {questions.map((question, qi_index) => (
                <div
                  key={question._id}
                  onClick={() => {
                    setDpOrQuestion("question");
                    setCurrentQuestion(qi_index);
                  }}
                  className={classNames(
                    "w-12 h-12 flex justify-center items-center click-action hover:cursor-pointer",
                    question.userAnswer
                      ? "bg-[#203772] text-white font-bold"
                      : "bg-gray-200",
                    dpOrQuestion === "questions" &&
                      qi_index === currentQuestion &&
                      "border-2 border-[#203772]"
                  )}
                >
                  {qi_index + 1}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamSidebar;
