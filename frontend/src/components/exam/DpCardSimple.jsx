import React, { useState, useEffect, useRef } from "react";
import ConfirmModal from "../common/ConfirmModal";
import CustomImage from "../common/CustomImage";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function DpCardSimple({
  dps,
  setDps,
  currentDp,
  currentQuestion,
  setCurrentQuestion,
  setCurrentDp,
}) {
  const dpRef = useRef(null);
  useEffect(() => {
    if (currentQuestion === 0) {
      dpRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentQuestion]);
  const setAnswer = (answer) => {
    const tempDps = JSON.parse(JSON.stringify(dps));
    tempDps[currentDp].questions[currentQuestion].userAnswer = answer;
    setDps(tempDps);
  };
  const next = (answer) => {
    setAnswer(answer);
    if (currentQuestion < dps[currentDp].questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentDp < dps.length - 1) {
      setCurrentDp(currentDp + 1);
      setCurrentQuestion(0);
    }
  };
  const Question = ({ qi_index, question, answer: _answer, scrollHere }) => {
    const questionRef = useRef(null);
    useEffect(() => {
      if (scrollHere)
        questionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, [scrollHere]);
    const [answer, setAnswer] = useState();
    useEffect(() => {
      console.log("Question");
      if (!_answer) {
        question.__t === "MultiChoice" &&
          setAnswer(Array(question.answers.length).fill(false));
        question.__t === "ShortAnswer" && setAnswer("");
        question.__t === "TrueOrFalse" && setAnswer(false);
      } else {
        setAnswer(_answer);
      }
    }, [question, _answer]);

    const [openConfirmModal, setOpenConfirmModal] = useState(false);
    const [openConfirmNumberOfAnswerModal, setOpenConfirmNumberOfAnswerModal] =
      useState(false);
    const handleClick = () => {
      if (answer)
        if (
          question.answers.length > 7 && // it is long question
          answer.filter((_) => _).length !==
            question.answers.filter(({ answer }) => answer).length
        )
          setOpenConfirmNumberOfAnswerModal(true);
        else setOpenConfirmModal(true);
    };
    const onConfirm = () => {
      next(answer);
    };

    return (
      <>
        <div ref={questionRef} className={`mt-2 px-6 py-2 text-lg font-bold`}>
          Question {qi_index + 1} -{" "}
          {question.__t === "MultiChoice" && "Question à réponses multiples"}
          {question.__t === "ShortAnswer" &&
            "Question à réponse ouverte et courte"}
        </div>
        <div className="px-6 py-2 text-md">{question.question}</div>
        {question.imageUrl &&
          (isImage(question.imageUrl) ? (
            <CustomImage
              src={process.env.REACT_APP_SERVER_URL + "/" + question.imageUrl}
              alt={"Visual clarification regarding the dp"}
              className="w-[350px] m-auto mb-10"
            />
          ) : (
            <video
              className="w-[350px] m-auto mb-10"
              controls
              src={process.env.REACT_APP_SERVER_URL + "/" + question.imageUrl}
            />
          ))}
        <div className="px-6 py-2 text-md">
          {question.__t === "MultiChoice" &&
            question.answers.map((item, index) => (
              <div key={index} className="mt-2">
                <div
                  className={classNames(
                    "px-4 py-2 flex items-center gap-3",
                    answer?.[index]
                      ? "bg-[#203772] text-white font-bold"
                      : "bg-[#D4E7FB] "
                  )}
                >
                  <input
                    id={"answer" + index}
                    onChange={() => {
                      if (!_answer) {
                        const tempAnswer = JSON.parse(JSON.stringify(answer));
                        tempAnswer[index] = !tempAnswer[index];
                        setAnswer(tempAnswer);
                      }
                    }}
                    checked={answer?.[index]}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-100 text-primary-600 focus:ring-primary-500"
                  />
                  Réponse {String.fromCharCode("A".charCodeAt(0) + index)}
                </div>
                <div className="border-2 border-t-0 border-gray-200  px-4 py-2">
                  {item.choice}
                </div>
              </div>
            ))}
          {question.__t === "ShortAnswer" && (
            <div className="mt-2">
              <div className="px-4 py-2 flex items-center gap-3 bg-[#D4E7FB] ">
                Réponse
              </div>
              <div className="border-2 border-t-0 border-gray-200">
                <input
                  className="w-full block border-0  px-4 py-2 text-gray-900 focus:ring-[#203772] sm:text-sm sm:leading-6"
                  type="text"
                  value={answer}
                  placeholder="Taper votre réponse ici"
                  onChange={(e) => {
                    if (!_answer) {
                      setAnswer(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {!_answer && (
          <div className="px-6 py-6 flex flex-wrap justify-between flex-row-reverse">
            <button
              onClick={() => handleClick()}
              className="click-action px-8 py-2 text-lg bg-[#E2959A] text-white border-transparent border-2"
            >
              Valider la réponse
            </button>
          </div>
        )}
        <ConfirmModal
          open={openConfirmModal}
          setOpen={setOpenConfirmModal}
          onConfirm={onConfirm}
        />
        <ConfirmModal
          open={openConfirmNumberOfAnswerModal}
          setOpen={setOpenConfirmNumberOfAnswerModal}
          content={`You must select ${
            question.answers.filter(({ answer }) => answer).length
          } answers!`}
          withOutCancel
        />
      </>
    );
  };
  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  };
  return (
    <div
      ref={dpRef}
      className="bg-white py-16 px-4 md:px-16 justify-center items-center flex flex-col"
    >
      <div className="lg:w-5/6 h-full">
        <div className="bg-[#203772] px-12 text-white font-bold py-4 text-xl">
          {`DP ${currentDp + 1}`}
        </div>
        <div className="px-6 py-2 text-md">{dps[currentDp]?.desc}</div>
        {dps[currentDp].imageUrl &&
          (isImage(dps[currentDp].imageUrl) ? (
            <CustomImage
              src={
                process.env.REACT_APP_SERVER_URL + "/" + dps[currentDp].imageUrl
              }
              alt={"Visual clarification regarding the dp"}
              className="w-[350px] m-auto mb-10"
            />
          ) : (
            <video
              className="w-[350px] m-auto mb-10"
              controls
              src={
                process.env.REACT_APP_SERVER_URL + "/" + dps[currentDp].imageUrl
              }
            />
          ))}
        {dps[currentDp].questions.map(
          (question, qi_index) =>
            (qi_index === 0 ||
              !!dps[currentDp].questions[qi_index - 1].userAnswer) && (
              <Question
                qi_index={qi_index}
                question={question}
                answer={question.userAnswer}
                next={next}
                scrollHere={qi_index && qi_index === currentQuestion}
              />
            )
        )}
      </div>
    </div>
  );
}

export default DpCardSimple;
