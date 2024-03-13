import React, { useEffect } from "react";

import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";

import { useState } from "react";
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
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useAuth } from "../../providers/authProvider";
import { useCard } from "../../providers/cardProvider";
import { useQuiz } from "../../hooks/useQuiz";
import { useNotification } from "../../providers/notificationProvider";
import CustomImage from "../common/CustomImage";

function QuestionCard({ question: _question, setQuestions, index, next }) {
  const { setCurrentQuestion, questionToShare, setQuestionToShare } = useQuiz();
  const { user } = useAuth();
  const authHttpClient = useAuthHttpClient();
  const [question, setQuestion] = useState(_question);
  const { showCard } = useCard();
  useEffect(() => {
    setQuestion(_question);
  }, [_question]);
  const [answer, setAnswer] = useState();
  useEffect(() => {
    _question.type === "MultiChoice" &&
      setAnswer(Array(question.choices.length).fill(false));
    _question.type === "ShortAnswer" && setAnswer("");
    _question.type === "TrueOrFalse" && setAnswer(false);
  }, [question?.choices.length, _question]);

  var bgColor, borderColor, textColor;
  if (!question?.result) {
    borderColor = "border-gray-300";
    textColor = "text-gray-800";
    bgColor = "bg-white";
  } else if (question.result.score > 15) {
    borderColor = "border-green-dark";
    textColor = "text-green-dark";
    bgColor = "bg-green-bg";
  } else if (question.result.score > 3) {
    borderColor = "border-orange-dark";
    textColor = "text-orange-dark";
    bgColor = "bg-orange-bg";
  } else {
    borderColor = "border-red-dark";
    textColor = "text-red-dark";
    bgColor = "bg-red-bg";
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitAnswer = async () => {
    console.log(_question.type, answer);
    setIsSubmitting(true);
    try {
      const response = await authHttpClient.post("/answer", {
        user_id: user._id,
        question: {
          question_id: question._id,
          type: question.__t,
        },
        answer: answer,
      });
      let answeredQuestion = {
        ...question,
        result: {
          score: response.data.data.score,
          comment: response.data.data.question.comment,
          cards: response.data.data.question.cards,
        },
      };
      switch (_question.type) {
        case "MultiChoice":
          answeredQuestion.result.choices = question.choices.map((_, i) => ({
            correctAnswer: response.data.data.question.answers[i].answer,
            yourAnswer: answer[i],
            desc: response.data.data.question.answers[i].desc,
          }));
          break;
        case "ShortAnswer":
          answeredQuestion.result.yourAnswer = answer;
          break;
        default:
          answeredQuestion.result.yourAnswer = answer;
          break;
      }
      console.log(answeredQuestion);
      setQuestion(answeredQuestion);
      setQuestions((questions) => [
        ...questions.slice(0, index),
        answeredQuestion,
        ...questions.slice(index + 1),
      ]);
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  };

  const [showShareLinkModal, openShareLinkModal] = useState(false);
  const [showPlaylistSlide, openPlaylistSlide] = useState(false);
  const [showReportSlide, openReportSlide] = useState(false);

  const { showNotification } = useNotification();
  const showRef = () => {
    showNotification(
      `Source : Référentiel de Neurologie 2018, p.289
      Tags : ${question.tags.join(", ")}`
    );
  };
  const showStatistics = () => {
    showNotification(
      `Last attempted : ${question.statistics.lastAttempt}
      Last score : ${question.statistics.lastScore}
      Success rate : ${question.statistics.successRate}% of users score 20/20`
    );
  };
  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  };

  return (
    <>
      <div className="bg-white h-screen py-16 px-4 md:px-16 flex justify-center items-center">
        <div className="lg:w-5/6 h-full flex flex-col overflow-hidden shadow-lg shadow-gray-700 rounded-xl">
          <div
            className={`border-2 ${borderColor} ${bgColor} ${textColor} rounded-t-xl px-12 py-3 flex justify-between`}
          >
            <Label colorInherit>
              Question {index + 1}
              <span className="rounded bg-blue-light text-white ml-2 my-1 px-1 text-xs text-center">
                {question.level}
              </span>
            </Label>
            {question.result && `${question.result.score}/${question.weight}`}
          </div>
          <div className="flex-1 overflow-auto border-x-2 border-gray-300">
            <div className="px-12 py-6">{question.content}</div>
            {question.imageUrl &&
              (isImage(question.imageUrl) ? (
                <CustomImage
                  src={
                    process.env.REACT_APP_SERVER_URL + "/" + question.imageUrl
                  }
                  alt={"Visual clarification regarding the question"}
                  className="w-[350px] m-auto mb-10"
                />
              ) : (
                <video
                  className="w-[350px] m-auto mb-10"
                  controls
                  src={
                    process.env.REACT_APP_SERVER_URL + "/" + question.imageUrl
                  }
                />
              ))}
            {question.type === "MultiChoice" &&
              question.choices.map((item, idx) => (
                <Choice
                  key={`${question._id}_${idx}`}
                  label={String.fromCharCode("A".charCodeAt(0) + idx)}
                  content={item}
                  answered={!!question.result}
                  checked={
                    question.result
                      ? question.result.choices[idx].yourAnswer
                      : answer?.[idx]
                  }
                  clickAction={
                    question.result
                      ? () => {}
                      : () => {
                          setAnswer((prev) => {
                            return prev.map((_, i) => {
                              return i === idx ? !prev[i] : prev[i];
                            });
                          });
                        }
                  }
                  isRight={question.result?.choices[idx].correctAnswer}
                  desc={question.result?.choices[idx].desc}
                />
              ))}
            {question.type === "ShortAnswer" && (
              <div className="px-16 mb-3">
                {question.result ? (
                  <div
                    className={`border-2 rounded-lg px-8 py-2 ${
                      question.result.score === 20
                        ? "bg-green-bg border-green-dark"
                        : "bg-red-bg border-red-dark"
                    }`}
                  >
                    <div className="font-bold">
                      {question.result.yourAnswer}
                    </div>
                    <div>{question.choices.join(", ")}</div>
                  </div>
                ) : (
                  <input
                    className="w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    type="text"
                    value={
                      question.result ? question.result.yourAnswer : answer
                    }
                    onChange={
                      question.result
                        ? () => {}
                        : (e) => {
                            setAnswer(e.target.value);
                          }
                    }
                  />
                )}
              </div>
            )}
            {question.result && question.result.comment && (
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
                    <p>{question.result.comment}</p>
                  </div>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {question.result.cards.map((card) => (
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
                  setQuestionToShare(question);
                  openShareLinkModal(true);
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
            <button
              onClick={
                question.result
                  ? next
                  : () => {
                      submitAnswer();
                    }
              }
              className="click-action px-8 py-4 text-lg bg-primary-600 rounded-lg text-white border-transparent border-2 hover:bg-primary-600"
            >
              {question.result ? "Suivant" : "Soumettre"}
            </button>
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

export default QuestionCard;
