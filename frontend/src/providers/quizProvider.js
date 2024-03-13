import { differenceInDays, format } from "date-fns";
import { createContext, useState } from "react";

export const parseQuestion = (question) => {
  let parsedQuestion;
  switch (question.__t) {
    case "MultiChoice":
      parsedQuestion = {
        _id: question._id,
        level: question.difficulty ? "A" : "B",
        weight: 20,
        // src: question.src,
        src: "Référentiel de Neurologie 2018, p.289",
        // type: question.type,
        type: question.__t,
        tags: question.tags,
        statistics: {
          lastAttempt: question.score
            ? `${differenceInDays(
                Date.now(),
                new Date(question.score.last_assess)
              )}days ago`
            : "",
          lastScore: question.score
            ? `${question.score.user_score}/${question.score.total_score}`
            : "",
          successRate: question.statistics.total
            ? Math.round(
                (question.statistics.success / question.statistics.total) * 100
              )
            : 0,
        },
        content: question.question,
        choices: question.answers.map(({ choice }) => choice),
        imageUrl: question.imageUrl,
      };
      break;
    case "ShortAnswer":
      parsedQuestion = {
        _id: question._id,
        level: question.difficulty ? "A" : "B",
        weight: 20,
        // src: question.src,
        src: "Référentiel de Neurologie 2018, p.289",
        // type: question.type,
        type: question.__t,
        tags: question.tags.map(({ name }) => name),
        statistics: {
          lastAttempt: question.score
            ? `${differenceInDays(
                Date.now(),
                new Date(question.score.last_assess)
              )}days ago`
            : "",
          lastScore: question.score
            ? `${question.score.user_score}/${question.score.total_score}`
            : "",
          successRate: question.statistics.total
            ? Math.round(
                (question.statistics.success / question.statistics.total) * 100
              )
            : 0,
        },
        content: question.question,
        choices: question.answers.map((choice) => choice),
        imageUrl: question.imageUrl,
      };
      break;
    case "TrueOrFalse":
      parsedQuestion = {
        _id: question._id,
        level: question.difficulty ? "A" : "B",
        weight: 20,
        // src: question.src,
        src: "Référentiel de Neurologie 2018, p.289",
        // type: question.type,
        type: question.__t,
        tags: question.tags,
        statistics: {
          lastAttempt: question.score
            ? `${differenceInDays(
                Date.now(),
                new Date(question.score.last_assess)
              )}days ago`
            : "",
          lastScore: question.score
            ? `${question.score.user_score}/${question.score.total_score}`
            : "",
          successRate: question.statistics.total
            ? Math.round(
                (question.statistics.success / question.statistics.total) * 100
              )
            : 0,
        },
        content: question.question,
        imageUrl: question.imageUrl,
      };
      break;
    default:
      break;
  }
  return parsedQuestion;
};
export const QuizContextProvider = (props) => {
  const [selectedQuestions, setSelectedQuestions] = useState([]); //only ids , it is for exam/test with saved questions
  const [questions, setQuestions] = useState([]);
  const [openTakeTestModal, setOpenTakeTestModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState();
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openCreateTestAnnales, setOpenCreateTestAnnales] = useState(false);

  const [questionToShare, setQuestionToShare] = useState({});
  const [isShareDp, setIsShareDp] = useState(false);

  const loadQuestions = (rawQuestions) => {
    setQuestions(rawQuestions.map(parseQuestion));
  };
  const value = {
    questions,
    setQuestions,
    selectedQuestions,
    setSelectedQuestions,
    loadQuestions,
    openTakeTestModal,
    setOpenTakeTestModal,
    currentQuestion,
    setCurrentQuestion,
    selectedItem,
    selectedMatiere,
    setSelectedItem,
    setSelectedMatiere,
    openCreateTestAnnales,
    setOpenCreateTestAnnales,
    questionToShare,
    setQuestionToShare,
    isShareDp,
    setIsShareDp,
  };

  return (
    <QuizContext.Provider value={value}>{props.children}</QuizContext.Provider>
  );
};

export const QuizContext = createContext({});
