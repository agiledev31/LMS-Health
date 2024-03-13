import { AuthProvider } from "./authProvider";
import { CardProvider } from "./cardProvider";
import { ExamContextProvider } from "./examProvider";
import { DataProvider } from "./learningDataProvider";
import { NotificationProvider } from "./notificationProvider";
import { QuizContextProvider } from "./quizProvider";

const Provider = (props) => {
  return (
    <AuthProvider>
      <QuizContextProvider>
        <DataProvider>
          <ExamContextProvider>
            <CardProvider>
              <NotificationProvider>{props.children}</NotificationProvider>
            </CardProvider>
          </ExamContextProvider>
        </DataProvider>
      </QuizContextProvider>
    </AuthProvider>
  );
};

export default Provider;
