import React, { useState } from "react";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";

import Label from "../common/Label";
import Choice from "./Choice";
import Speedometer from "../icons/Speedometer";
import ShareIcon from "../icons/ShareIcon";
import Heart from "../icons/Heart";
import InfoIcon from "../icons/InfoIcon";
import InfoCircle from "../icons/InfoCircle";

import ShareLinkModal from "./ShareLinkModal";
import SlidePlaylist from "./SlidePlaylist";
import SlideReport from "./SlideReport";
import { useCard } from "../../providers/cardProvider";
import { useQuiz } from "../../hooks/useQuiz";
import { useNotification } from "../../providers/notificationProvider";
import { differenceInDays } from "date-fns";

function QuestionResultCard({
  dpOrQuestion,
  desc,
  question,
  currentDp,
  currentQuestion,
  next,
  id,
  dp,
  isFromDp,
}) {
  const { setCurrentQuestion, setQuestionToShare, isShareDp, setIsShareDp } =
    useQuiz();
  const { showCard } = useCard();
  var bgColor, borderColor, textColor;
  if (!question?.userAnswer) {
    borderColor = "border-gray-300";
    textColor = "text-gray-800";
    bgColor = "bg-white";
  } else if (question.user_score > 15) {
    borderColor = "border-green-dark";
    textColor = "text-green-dark";
    bgColor = "bg-green-bg";
  } else if (question.user_score > 3) {
    borderColor = "border-orange-dark";
    textColor = "text-orange-dark";
    bgColor = "bg-orange-bg";
  } else {
    borderColor = "border-red-dark";
    textColor = "text-red-dark";
    bgColor = "bg-red-bg";
  }

  const [showShareLinkModal, openShareLinkModal] = useState(false);
  const [showPlaylistSlide, openPlaylistSlide] = useState(false);
  const [showReportSlide, openReportSlide] = useState(false);

  const { showNotification } = useNotification();
  const showRef = () => {
    showNotification(
      `Source : Référentiel de Neurologie 2018, p.289
      Tags : ${question.tags.map(({ name }) => name).join(", ")}`
    );
  };
  const showStatistics = () => {
    showNotification(
      `Last attempted : ${
        question.lastAttempt
          ? `${differenceInDays(
              Date.now(),
              new Date(question.lastAttempt)
            )}days ago`
          : ""
      }
      Last score : ${
        question.lastScore !== undefined
          ? `${question.lastScore}/${question.total_score}`
          : ""
      }
      Success rate : ${
        question.statistics.total
          ? Math.round(
              (question.statistics.success / question.statistics.total) * 100
            )
          : 0
      }% of users score 20/20`
    );
  };

  return (
    <>
      <div
        className="bg-white py-4 px-4 md:px-16 flex justify-center items-center"
        id={id}
      >
        <div className="lg:w-5/6 sm:w-full flex flex-col shadow-lg shadow-gray-700 rounded-xl">
          <div
            className={`border-2 ${borderColor} ${bgColor} ${textColor} rounded-t-xl px-12 py-3 flex justify-between`}
          >
            <Label colorInherit>
              {dpOrQuestion === "dp"
                ? `DP${currentDp + 1} - Question ${currentQuestion + 1}`
                : `QI - Question ${currentQuestion + 1}`}
              <span className="rounded bg-blue-light text-white ml-2 my-1 px-1 text-xs text-center">
                {question.difficulty ? "A" : "B"}
              </span>
            </Label>
            {question.userAnswer &&
              `${question.user_score}/${question.total_score}`}
          </div>
          <div className="flex-1 overflow-auto border-x-2 border-gray-300">
            {desc && currentQuestion === 0 && (
              <div className="px-12 py-2 text-md">{desc}</div>
            )}
            <div className="mt-2 px-12 py-2 text-lg font-bold">
              Question {currentQuestion + 1} -{" "}
              {question.__t === "MultiChoice" &&
                "Question à réponses multiples"}
              {question.__t === "ShortAnswer" &&
                "Question à réponse ouverte et courte"}
            </div>
            <div className="px-12 pt-2 pb-6">{question.question}</div>
            {question.__t === "MultiChoice" &&
              question.answers.map(({ choice, answer, desc }, idx) => (
                <Choice
                  key={`${question._id}_${idx}`}
                  label={String.fromCharCode("A".charCodeAt(0) + idx)}
                  content={choice}
                  answered={!!question.userAnswer}
                  checked={question.userAnswer && question.userAnswer[idx]}
                  isRight={answer}
                  desc={desc}
                />
              ))}
            {question.__t === "ShortAnswer" &&
              (question.user_score !== undefined ? (
                <div
                  className={`border-2 rounded-lg mx-16 px-8 py-2 ${
                    question.user_score === 20
                      ? "bg-green-bg border-green-dark"
                      : "bg-red-bg border-red-dark"
                  }`}
                >
                  <div className="font-bold">{question.userAnswer}</div>
                  <div>{question.answers.join(", ")}</div>
                </div>
              ) : (
                <div className="px-16 mb-3">
                  <input
                    className="w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    type="text"
                    value={question.userAnswer}
                    onChange={() => {}}
                  />
                </div>
              ))}
            {question.comment && (
              <>
                <div className="flex gap-2 items-center">
                  <div
                    className="my-6 block h-px w-full bg-gray-200"
                    aria-hidden="true"
                  />
                  <div className="text-center">COMMENTAIRE</div>
                  <div
                    className="my-6 block h-px w-full bg-gray-200"
                    aria-hidden="true"
                  />
                </div>
                <div className="px-8">
                  <div className="px-6 bg-gray-100 rounded-lg p-2">
                    <p>{question.comment}</p>
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {question.cards.map((card) => (
                      <Label
                        onClick={() => {
                          showCard(card);
                        }}
                      >
                        {card.name}
                        <ArrowSmallRightIcon className="w-4 h-4" />
                      </Label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="border-2 border-t-0 border-gray-300 rounded-b-xl p-12 pt-3 flex flex-wrap justify-between">
            <div className="flex items-center gap-3">
              <div
                className="hover:cursor-pointer hover:text-blue-500"
                onClick={() => {
                  if (isFromDp) {
                    setIsShareDp(true);
                    setQuestionToShare(dp);
                    openShareLinkModal(true);
                  } else {
                    setIsShareDp(false);
                    setQuestionToShare(question);
                    openShareLinkModal(true);
                  }
                }}
              >
                <ShareIcon />
              </div>
              <div
                className="hover:cursor-pointer hover:text-blue-500"
                onClick={() => {
                  setCurrentQuestion(question._id);
                  openPlaylistSlide(true);
                }}
              >
                <Heart />
              </div>
              <div
                onClick={() => {
                  showStatistics();
                }}
                className="hover:cursor-pointer hover:text-blue-500"
              >
                <Speedometer />
              </div>
              <div
                onClick={() => {
                  openReportSlide(true);
                }}
                className="hover:cursor-pointer hover:text-blue-500"
              >
                <InfoIcon />
              </div>
              <div
                onClick={() => {
                  showRef();
                }}
                className="hover:cursor-pointer hover:text-blue-500"
              >
                <InfoCircle />
              </div>
            </div>
            {/* <button
              onClick={() => {
                next();
              }}
              className="click-action px-8 py-4 text-lg bg-primary-600 rounded-lg text-white border-transparent border-2 hover:bg-primary-600"
            >
              Suivant
            </button> */}
          </div>
        </div>
      </div>
      <ShareLinkModal open={showShareLinkModal} setOpen={openShareLinkModal} />
      <SlidePlaylist open={showPlaylistSlide} setOpen={openPlaylistSlide} />
      <SlideReport
        open={showReportSlide}
        question_id={question._id}
        setOpen={openReportSlide}
      />
    </>
  );
}

export default QuestionResultCard;
