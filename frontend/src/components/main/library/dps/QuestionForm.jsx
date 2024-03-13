import { useState } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import FileUpload from "../../../common/FileUpload";

const questionTypes = [
  { type: "Basic question", n: 5, modelType: "MultiChoice" },
  { type: "QROC", n: 3, modelType: "ShortAnswer" },
  { type: "Long question", n: 12, modelType: "MultiChoice" },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function QuestionForm({
  selectedQuestion,
  setSelectedQuestion,
  cards,
  err,
  setErr,
  fileDataQ,
  setFileDataQ,
}) {
  const [cardQuery, setCardQuery] = useState("");
  const filteredCards =
    cardQuery === ""
      ? cards
      : cards.filter((card) => {
          return card.name.toLowerCase().includes(cardQuery.toLowerCase());
        });
  const changeType = (type) => {
    if (selectedQuestion.type === type) return;
    const tempQuestion = { ...selectedQuestion };
    tempQuestion.type = type;
    const answers = Array(
      questionTypes.find((questionType) => questionType.type === type).n
    ).fill(
      type === "Basic question" || type === "Long question"
        ? {
            choice: "",
            desc: "",
            answer: false,
          }
        : ""
    );
    setSelectedQuestion({ ...tempQuestion, answers: answers });
  };
  const increaseAnswers = () => {
    const tempQuestion = { ...selectedQuestion };
    const answers = [...selectedQuestion.answers];
    answers.push(
      tempQuestion.type === "Basic question" ||
        tempQuestion.type === "Long question"
        ? {
            choice: "",
            desc: "",
            answer: false,
          }
        : ""
    );
    setSelectedQuestion({ ...tempQuestion, answers: answers });
  };

  const decreaseAnswers = () => {
    if (selectedQuestion.answers.length < 2) return;
    const tempQuestion = { ...selectedQuestion };
    const answers = [...selectedQuestion.answers];
    answers.pop();
    setSelectedQuestion({ ...tempQuestion, answers: answers });
  };

  return (
    <>
      <div className="mt-2 flex flex-wrap justify-between items-center gap-2">
        {/* question type */}
        <div className="flex rounded-lg border border-gray-300 shadow-sm text-sm font-bold divide-x divide-gray-300">
          {questionTypes.map(({ type }, index) => (
            <div
              key={index}
              onClick={() => changeType(type)}
              className="flex gap-2 items-center min-w-fit px-4 py-2 border-gray-300 hover:cursor-pointer hover:bg-gray-100"
            >
              <div
                className={classNames(
                  `w-4 h-4 rounded-full border-2 border-gray-400`,
                  selectedQuestion.type === type && "bg-gray-400"
                )}
              />
              {type}
            </div>
          ))}
        </div>
        {/* number of answers */}
        <div className="flex items-center gap-2">
          <div className="text-center max-w-fit">Number of answers</div>
          <div className="flex items-center rounded-lg border border-gray-300 shadow-sm text-sm font-bold divide-x divide-gray-300">
            <div
              className="flex items-center min-w-fit p-2 border-gray-300 hover:cursor-pointer hover:bg-gray-100 rounded-l-lg"
              onClick={() => decreaseAnswers()}
            >
              <MinusIcon className="h-5" />
            </div>
            <div className="flex items-center min-w-fit px-4 py-2 border-gray-300 hover:cursor-pointer hover:bg-gray-100">
              {selectedQuestion.answers?.length}
            </div>
            <div
              className="flex items-center min-w-fit p-2 border-gray-300 hover:cursor-pointer hover:bg-gray-100 rounded-r-lg"
              onClick={() => increaseAnswers()}
            >
              <PlusIcon className="h-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="my-2 flex gap-2">
        <textarea
          type="text"
          className={classNames(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6",
            err.question && "ring-red-600"
          )}
          value={selectedQuestion.question}
          placeholder="Type the question here..."
          onChange={(e) => {
            const tempErr = { ...err };
            tempErr.question = null;
            setErr(tempErr);
            const tempQuestion = { ...selectedQuestion };
            tempQuestion.question = e.target.value;
            setSelectedQuestion(tempQuestion);
          }}
        />
      </div>
      <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
        <FileUpload
          selectedFile={fileDataQ}
          setSelectedFile={setFileDataQ}
          defaultImageUrl={selectedQuestion.imageUrl}
        />
      </div>
      {/* answers */}
      {(selectedQuestion.type === "Basic question" ||
        selectedQuestion.type === "Long question") && (
        <div className="text-left my-2 ml-2 flex flex-col gap-2 text-sm">
          {selectedQuestion.answers?.map(({ ..._ }, index) => {
            return (
              <MultiChoice
                key={index}
                index={index}
                content={_}
                err={err}
                contentChange={(content) => {
                  if (err.answers) {
                    const errTemp = { ...err };
                    errTemp.answers[index] = null;
                    setErr(errTemp);
                  }
                  const tempQuestion = { ...selectedQuestion };
                  const answers = [...selectedQuestion.answers];
                  answers[index] = content;
                  tempQuestion.answers = answers;
                  setSelectedQuestion(tempQuestion);
                }}
              />
            );
          })}
        </div>
      )}
      {selectedQuestion.type === "QROC" && (
        <div className="my-2 text-left text-sm">
          Answer
          <div className="my-2 grid grid-cols-3 gap-2">
            {selectedQuestion.answers?.map((answer, i) => (
              <div key={i} className="min-w-fit">
                <input
                  className={classNames(
                    "w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6",
                    err.answers && err.answers[i] && "ring-red-600"
                  )}
                  type="text"
                  value={answer}
                  onChange={(e) => {
                    if (err.answers) {
                      const errTemp = { ...err };
                      errTemp.answers[i] = null;
                      setErr(errTemp);
                    }
                    const tempQuestion = { ...selectedQuestion };
                    tempQuestion.answers[i] = e.target.value;
                    setSelectedQuestion(tempQuestion);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
        Commentaire
      </label>
      <div className="my-2 flex gap-2">
        <textarea
          type="text"
          className={classNames(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 bg-gray-100",
            err.comment && "ring-red-600"
          )}
          value={selectedQuestion.comment}
          onChange={(e) => {
            const errTemp = { ...err };
            errTemp.comment = null;
            setErr(errTemp);
            setSelectedQuestion({
              ...selectedQuestion,
              comment: e.target.value,
            });
          }}
        />
      </div>
      <Combobox
        as="div"
        value={selectedQuestion.cards}
        onChange={(cards) => {
          const tempQuestion = { ...selectedQuestion };
          tempQuestion.cards = cards;
          setSelectedQuestion(tempQuestion);
        }}
        multiple
      >
        <Combobox.Label className="text-left block text-sm font-medium leading-6 text-gray-900">
          Select Cards
        </Combobox.Label>
        <div className="flex gap-2">
          <div className="relative mt-2 max-w-fit">
            <Combobox.Input
              className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              onChange={(e) => setCardQuery(e.target.value)}
              // displayValue={(items) => { return items.map((item) => item.name).join(", "); }}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>

            {filteredCards?.length > 0 && (
              <Combobox.Options className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredCards.map((card) => (
                  <Combobox.Option
                    key={card._id}
                    value={card._id}
                    className={({ active }) =>
                      classNames(
                        "relative cursor-default select-none py-2 pl-3 pr-9",
                        active ? "bg-primary-600 text-white" : "text-gray-900"
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(
                              "ml-3 truncate",
                              selected && "font-semibold"
                            )}
                          >
                            {card.name}
                          </span>
                        </div>

                        {selected && (
                          <span
                            className={classNames(
                              "absolute inset-y-0 right-0 flex items-center pr-4",
                              active ? "text-white" : "text-primary-600"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </div>
          <div className="mt-1.5 flex-1 rounded-lg border-dashed border-2 border-gray-200 p-2">
            <div className="flex gap-2 flex-wrap ">
              {selectedQuestion.cards.map((_, i) => (
                <div
                  className="px-2  hover:text-red-900 hover:border-red-900 hover:cursor-pointer min-w-fit border border-gray-400 rounded-md text-[12px]"
                  onClick={() => {
                    const tempQuestion = { ...selectedQuestion };
                    tempQuestion.cards.splice(i, 1);
                    setSelectedQuestion(tempQuestion);
                  }}
                >
                  {cards.find((card) => card._id === _)?.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Combobox>
    </>
  );
}

const MultiChoice = ({ content, contentChange, index, err }) => {
  const { choice, desc, answer } = content;
  return (
    <div className="mt-2 w-full">
      Proposition {String.fromCharCode("A".charCodeAt(0) + index)}
      <div className="flex gap-2">
        <div className="mt-2.5">
          <input
            type="checkbox"
            checked={answer}
            className="h-5 w-5 mx-2 rounded border-gray-300 text-primary-600 focus:ring-primary-600"
            onChange={(e) => {
              const tempContent = { ...content };
              tempContent.answer = e.target.checked;
              contentChange(tempContent);
            }}
          />
        </div>
        <div className="flex-1 flex flex-col gap-1 my-1">
          <div>
            <input
              className={classNames(
                "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6",
                err.answers && err.answers[index] && "ring-red-600"
              )}
              type="text"
              value={choice}
              onChange={(e) => {
                const tempContent = { ...content };
                tempContent.choice = e.target.value;
                contentChange(tempContent);
              }}
            />
          </div>
          <div>
            <textarea
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 bg-gray-100"
              type="text"
              value={desc}
              onChange={(e) => {
                const tempContent = { ...content };
                tempContent.desc = e.target.value;
                contentChange(tempContent);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
