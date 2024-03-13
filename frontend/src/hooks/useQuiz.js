import { useContext } from 'react';
import { QuizContext } from '../providers/quizProvider'; 

export function useQuiz() {
    return useContext(QuizContext)
  }