import { createContext, useContext, useState } from "react";
import useAuthHttpClient from "../hooks/useAuthHttpClient";
import { useAuth } from "./authProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { HttpStatusCode } from "axios";
import { useQuiz } from "../hooks/useQuiz";

export const ExamContextProvider = (props) => {
  const navigator = useNavigate();
  const authHttpClient = useAuthHttpClient();
  const { user } = useAuth();
  const [selectedDps, setSelectedDps] = useState([]); // only [_id]
  const [selectedQuestions, setSelectedQuestions] = useState([]); // only [_id]
  const [dps, setDps] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState({ dps: [], questions: [] });
  const [openTakeExamModal, setOpenTakeExamModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  const [showCreateAnnaleTestModal, setShowCreateAnnaleTestModal] =
    useState(false);
  const [showFirstSignupModal, setShowFirstSignupModal] = useState(false);
  const [resumeSession, setResumeSession] = useState(null);
  const [doingLastSession, setDoingLastSession] = useState(false);
  const [pastExam, setPastExam] = useState(null);

  const quizProvider = useQuiz();
  const fetchReminder = async () => {
    const response = await authHttpClient.get(`/history/savedExam/` + user._id);

    if (!response.status == HttpStatusCode.Ok) {
      return;
    }
    if (response.data && response.data.data) {
      setResumeSession(response.data.data[0]);
      return;
    }
  };
  useEffect(() => {
    fetchReminder();
  }, []);

  const saveForResumeExam = (payload) => {
    setResumeSession(payload);
  };
  const deleteLastSession = async () => {
    const response = await authHttpClient.delete(
      `/history/savedExam/delete/` + user._id
    );

    if (!response.status == HttpStatusCode.Ok) {
      return;
    }
    setDoingLastSession(false);
    setResumeSession(null);
  };
  // resume last sessison
  const resumeLastSession = () => {
    if (!resumeSession) return;
    setDoingLastSession(true);

    if (resumeSession.is_exam) {
      setDps(resumeSession.exam_data.dps);
      setQuestions(resumeSession.exam_data.questions);

      navigator("/exam/");
      return;
    }
    quizProvider.setQuestions(resumeSession.exam_data.questions);
    navigator("/quiz/");
  };

  const submitAnswers = async (aux_dps, aux_questions) => {
    if (!aux_dps) {
      aux_dps = dps;
      aux_questions = questions;
    }

    try {
      setIsSubmitting(true);
      const resultDps = [];
      const resultQis = [];

      for (let i = 0; i < aux_dps.length; i++) {
        const answers = aux_dps[i].questions.map(
          ({ userAnswer }) => userAnswer
        );
        const response = await authHttpClient.post("/answer/dp/", {
          user_id: user._id,
          dp_id: aux_dps[i]._id,
          answers,
        });
        resultDps.push(response.data.data);
      }
      for (let i = 0; i < aux_questions.length; i++) {
        const answer = aux_questions[i].result
          ? aux_questions[i].result.choices.map((el) => el.yourAnswer)
          : undefined;

        const response = await authHttpClient.post("/answer", {
          user_id: user._id,
          question: {
            question_id: aux_questions[i]._id,
          },
          answer,
        });

        if (answer) {
          resultQis.push({
            ...response.data.data.question,
            user_score: response.data.data.score,
            userAnswer: answer,
            lastScore: response.data.data.lastScore,
            lastAttempt: response.data.data.lastAttempt,
            total_score: response.data.data.total_score,
          });
        } else {
          resultQis.push({
            ...response.data.data.question,
            user_score: 0,
            userAnswer: Array(aux_questions[i].answers.length).fill(false),
            lastScore: response.data.data.lastScore,
            lastAttempt: response.data.data.lastAttempt,
            total_score: response.data.data.total_score,
          });
        }
      }
      setDps([]);
      setQuestions([]);
      setResult({ dps: resultDps, questions: resultQis });
      setIsSubmitting(false);
      if (doingLastSession) {
        deleteLastSession();
      }
      navigator("/result/");
    } catch (e) {
      console.log(e);
      setIsSubmitting(false);
    }
  };
  const value = {
    isSubmitting,
    questions,
    setQuestions,
    selectedQuestions,
    setSelectedQuestions,
    dps,
    setDps,
    selectedDps,
    setSelectedDps,
    openTakeExamModal,
    setOpenTakeExamModal,
    submitAnswers,
    result,
    setResult,
    showCreateTestModal,
    setShowCreateTestModal,
    showFirstSignupModal,
    setShowFirstSignupModal,
    pastExam,
    setPastExam,
    showCreateAnnaleTestModal,
    setShowCreateAnnaleTestModal,
    resumeSession,
    resumeLastSession,
    setResumeSession,
    saveForResumeExam,
    fetchReminder,
  };

  return (
    <ExamContext.Provider value={value}>{props.children}</ExamContext.Provider>
  );
};

export const ExamContext = createContext({});

export function useExam() {
  return useContext(ExamContext);
}
