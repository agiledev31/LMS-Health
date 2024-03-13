import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Tabs from "../../Tabs";
import Breadcrumb from "../../Breadcrumb";
import {
  AcademicCapIcon,
  PaperClipIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import Overview from "./Overview";
import SavedQuestions from "./SavedQuestions";
import Cards from "./Cards";
import Toolbox from "./Toolbox";
import useAuthHttpClient from "../../../../hooks/useAuthHttpClient";
import { Spinner } from "../../../icons/Spinner";
import { useQuiz } from "../../../../hooks/useQuiz";
import ConfirmModal from "../../../common/ConfirmModal";

const Matiere = () => {
  const { id } = useParams();
  const navigator = useNavigate();
  const authHttpClient = useAuthHttpClient();
  const {
    setOpenTakeTestModal,
    setSelectedMatiere,
    setSelectedItem,
    selectedQuestions,
    loadQuestions,
  } = useQuiz();
  const [matiere, setMatiere] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [preparingTest, setPreparingTest] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [tabs, setTabs] = useState([
    { name: "Overview", icon: ViewColumnsIcon, current: true },
    { name: "Saved questions", icon: PaperClipIcon, current: false },
    // { name: "Cards", icon: ClipboardIcon, current: false },
    // { name: "Toolbox", icon: WrenchScrewdriverIcon, current: false },
  ]);

  const setCurrentTab = (selectedTab) => {
    setTabs(
      tabs.map((tab) => {
        if (selectedTab === tab.name) tab.current = true;
        else tab.current = false;
        return tab;
      })
    );
  };

  useEffect(() => {
    const fetchMatiere = async () => {
      try {
        const response = await authHttpClient.get(`/matiere/${id}`);
        setMatiere(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMatiere();
  }, [id]);

  const pages = [
    { name: "Library", href: "/library/", current: false },
    { name: matiere?.name, href: "#", current: true },
  ];

  const createTest = () => {
    if (!selectedQuestions.length) {
      setSelectedMatiere(id);
      setSelectedItem(null);
      setOpenTakeTestModal(true);
    } else {
      setOpenConfirmModal(true);
    }
  };

  const testFromPlaylist = () => {
    fetchQuestions();
  };

  const fetchQuestions = async () => {
    setPreparingTest(true);
    const questions = [];
    for (let i = 0; i < selectedQuestions.length; i++) {
      const response = await authHttpClient.get(
        `question/${selectedQuestions[i]}`
      );
      questions.push(response.data.data);
    }
    setPreparingTest(false);
    console.log(questions);
    loadQuestions(questions);
    navigator("/quiz");
  };

  const CreateTestButton = () => {
    return (
      <div className="flex gap-4">
        <div
          onClick={() => !preparingTest && createTest()}
          className="border-2 border-primary-600 rounded-full text-primary-600 flex gap-2 font-extrabold items-center px-4 click-action hover:cursor-pointer click-action py-1.5"
        >
          {preparingTest ? (
            <Spinner small center />
          ) : (
            <AcademicCapIcon className="w-6 h-6" />
          )}
          <p>Create a test</p>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="-mt-4 mb-6">
        <Breadcrumb pages={pages} />
      </div>
      <div className="flex justify-between">
        <div className="text-3xl font-bold flex-1 flex items-center gap-2">
          <img
            src={matiere?.image}
            alt={matiere?.name}
            className="-my-2 h-12 w-12 flex-shrink-0 rounded-lg"
          />
          <p className="flex-1 truncate">{matiere?.name}</p>
        </div>
        <CreateTestButton />
      </div>
      <Tabs tabs={tabs} setCurrentTab={setCurrentTab} />
      {isLoading ? (
        <div
          role="status"
          className="h-[70vh] pb-20 flex justify-center items-center"
        >
          <Spinner />
        </div>
      ) : (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
          {tabs.find((tab) => tab.current).name === "Overview" && (
            <Overview matiere={matiere} />
          )}
          {tabs.find((tab) => tab.current).name === "Saved questions" && (
            <SavedQuestions matiere_id={id} />
          )}
          {tabs.find((tab) => tab.current).name === "Cards" && (
            <Cards matiere_id={id} />
          )}
          {tabs.find((tab) => tab.current).name === "Toolbox" && (
            <Toolbox matiere_id={id} />
          )}
        </div>
      )}
      <ConfirmModal
        open={openConfirmModal}
        setOpen={setOpenConfirmModal}
        content={`Do you want to take the test with ${selectedQuestions.length} questions from this playlist?`}
        onConfirm={() => {
          testFromPlaylist();
        }}
      />
    </div>
  );
};

export default Matiere;
