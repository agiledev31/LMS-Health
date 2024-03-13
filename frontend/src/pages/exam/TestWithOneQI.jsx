import { useEffect, useState } from "react";
import QuestionCard from "../../components/exam/QuestionCard";
import { useParams } from "react-router-dom";
import { Spinner } from "../../components/icons/Spinner";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { parseQuestion } from "../../providers/quizProvider";
import { useExam } from "../../providers/examProvider";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../../hooks/useQuiz";
export default function TestWithOneQI() {
  const authHttpClient = useAuthHttpClient();
  const { id, dp } = useParams();
  const { selectedDps, setDps, selectedQuestions, setQuestions } = useExam();
  const navigator = useNavigate();
  const { loadQuestions } = useQuiz();
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        if (dp) {
          const response = await authHttpClient.get(`/dp/withDetails/${id}`);

          setDps([response.data.data]);
          setQuestions([]);
          navigator("/exam/");
          return;
        }
        const response = await authHttpClient.get(`/question/${id}`);
        loadQuestions([response.data.data]);
        navigator("/quiz");
      } catch (err) {
        console.log(err);
      }
    };
    id && fetchQuestion();
  }, [id]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Spinner />
    </div>
  );
}
