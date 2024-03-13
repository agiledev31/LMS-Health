import React, { useEffect, useState } from "react";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  FolderOpenIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/24/outline";
import Breadcrumb from "../../components/main/Breadcrumb";
import Tabs from "../../components/main/Tabs";
import All from "../../components/main/annales/All";
import MatOrItems from "../../components/main/annales/MatOrItems";
import Sessions from "../../components/main/annales/Sessions";
import { useExam } from "../../providers/examProvider";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components/icons/Spinner";
import { useQuiz } from "../../hooks/useQuiz";

function AnnalesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [tabs, setTabs] = useState([
    { name: "All", icon: FolderOpenIcon, current: true },
    // { name: "Matière/Items", icon: BriefcaseIcon, current: false },
    { name: "Session", icon: Square3Stack3DIcon, current: false },
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
  const pages = [{ name: "Annales", href: "/annales/", current: true }];
  const { selectedDps, setDps, selectedQuestions, setQuestions } = useExam();

  const { openCreateTestAnnales, setOpenCreateTestAnnales } = useQuiz();

  const createExam = () => {
    setOpenCreateTestAnnales(true);
  };

  return (
    <div>
      <div className="-mt-4 mb-6">
        <Breadcrumb pages={pages} />
      </div>
      <div className="flex justify-between">
        <div className="text-3xl font-bold">Annales</div>
        <div className="flex gap-4 items-center">
          <div>
            {selectedDps.length > 0 &&
              `${selectedDps.length}${
                selectedDps.length > 1 ? " DPs " : " DP "
              }`}
            {selectedDps.length > 0 && selectedQuestions.length > 0 && "and "}
            {selectedQuestions.length > 0 &&
              `${selectedQuestions.length}${
                selectedQuestions.length > 1 ? " Questions " : " Question "
              }`}
            {(selectedDps.length > 0 || selectedQuestions > 0) && `selected`}
          </div>
          <div
            onClick={() => {
              (selectedDps.length > 0 || selectedQuestions.length > 0) &&
                createExam();
            }}
            className={`${
              selectedDps.length > 0 || selectedQuestions.length > 0
                ? "text-primary-600 border-primary-600 "
                : "text-gray-300 border-gray-300 "
            } py-1.5 border-2 rounded-full flex gap-2 font-extrabold items-center px-4 click-action hover:cursor-pointer`}
          >
            <AcademicCapIcon className="w-6 h-6" />
            <p>{`Create an exam`}</p>
          </div>
        </div>
      </div>
      <Tabs tabs={tabs} setCurrentTab={setCurrentTab} />

      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        {tabs.find((tab) => tab.current).name === "All" && <All />}
        {tabs.find((tab) => tab.current).name === "Matière/Items" && (
          <MatOrItems />
        )}
        {tabs.find((tab) => tab.current).name === "Session" && <Sessions />}
      </div>
    </div>
  );
}

export default AnnalesPage;
