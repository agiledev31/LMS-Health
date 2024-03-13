import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Provider from "../../providers";
import Layout from "../../components/main/Layout";
import Sidebar from "../../components/main/Sidebar";
import Dashboard from "./Dashboard";
import LibraryPage from "./LibraryPage";
import Matiere from "../../components/main/library/matiere/Matiere";
import Item from "../../components/main/library/item/Item";
import AnnalesPage from "./AnnlaesPage";
import HistoryPage from "./HistoryPage";
import PlaylistsPage from "./PlaylistPage";
import Toolbox from "./Toolbox";
import Users from "./Users";
import TestPage from "../exam/Test";
import ExamPage from "../exam/Exam";
import ExamResultPage from "../exam/ExamResult";
import AddNewQuestionPage from "./AddQuestion";
import EditQuestionPage from "./EditQuestion";
import AddNewDPPage from "./AddDP";
import EditDPPage from "./EditDP";
import Colors from "../../components/common/Colors";
import DateAndTimePicker from "../../components/common/DateAndTimePicker";
import TakeTestModal from "../../components/exam/TakeTestModal";
import CardSlider from "../../components/common/CardSlider";
import Notification from "../../components/common/Notification";
import PlannerPage from "./Planner";
import Reports from "./Reports";
import TestWithOneQI from "../exam/TestWithOneQI";
import Settings from "./Settings";
import CreateTestModal from "./CreateTestModal";
import CreateTestAnnales from "../../components/exam/CreateTestAnnales";
import FirstSignupModal from "./FirstSignupModal";
import CreateAnnaleTestModal from "./CreateAnnaleTestModal";

const Main = () => {
  return (
    <BrowserRouter>
      <Provider>
        <CreateTestModal />
        <CreateAnnaleTestModal />
        <FirstSignupModal />
        <Routes>
          <Route
            path="/"
            element={
              <Layout Sidebar={Sidebar}>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/library/"
            element={
              <Layout Sidebar={Sidebar}>
                <LibraryPage />
              </Layout>
            }
          />
          <Route
            path="/library/matiere/:id?"
            element={
              <Layout Sidebar={Sidebar}>
                <Matiere />
              </Layout>
            }
          />
          <Route
            path="/library/item/:id?"
            element={
              <Layout Sidebar={Sidebar}>
                <Item />
              </Layout>
            }
          />
          <Route
            path="/annales/"
            element={
              <Layout Sidebar={Sidebar}>
                <AnnalesPage />
              </Layout>
            }
          />
          <Route
            path="/planner/"
            element={
              <Layout Sidebar={Sidebar}>
                <PlannerPage />
              </Layout>
            }
          />
          <Route
            path="/settings/"
            element={
              <Layout Sidebar={Sidebar}>
                <Settings />
              </Layout>
            }
          />
          <Route
            path="/playlists/"
            element={
              <Layout Sidebar={Sidebar}>
                <PlaylistsPage />
              </Layout>
            }
          />
          <Route
            path="/toolbox/"
            element={
              <Layout Sidebar={Sidebar}>
                <Toolbox />
              </Layout>
            }
          />

          <Route
            path="/history/"
            element={
              <Layout Sidebar={Sidebar}>
                <HistoryPage />
              </Layout>
            }
          />

          <Route
            path="/users/"
            element={
              <Layout Sidebar={Sidebar}>
                <Users />
              </Layout>
            }
          />
          <Route
            path="/reports/"
            element={
              <Layout Sidebar={Sidebar}>
                <Reports />
              </Layout>
            }
          />
          <Route path="/quiz/" element={<TestPage />} />
          {/* <Route path="/testResults"  */}
          <Route path="/quiz/:id?/:dp?" element={<TestWithOneQI />} />
          <Route path="/exam/" element={<ExamPage />} />
          <Route path="/result/" element={<ExamResultPage />} />
          <Route path="/addQuestion/" element={<AddNewQuestionPage />} />
          <Route path="/editQuestion/:id?" element={<EditQuestionPage />} />
          <Route path="/addDP/" element={<AddNewDPPage />} />
          <Route path="/editDP/:id?" element={<EditDPPage />} />
          <Route path="/colors/" element={<Colors />} />
          <Route path="/datePicker/" element={<DateAndTimePicker />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <TakeTestModal />
        <CreateTestAnnales />
        <CardSlider />
        <Notification />
      </Provider>{" "}
    </BrowserRouter>
  );
};

export default Main;
