import { Fragment, useEffect, useState } from "react";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";

import { useQuiz } from "../../hooks/useQuiz";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/authProvider";
import { useExam } from "../../providers/examProvider";
import { useData } from "../../providers/learningDataProvider";
import { Spinner, TinySpinner } from "../../components/icons/Spinner";
import ComboBoxTestModal from "./ComboBoxTestModal";
import { useRef } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function FirstSignupModal() {
  const { user, updateEducationalInformation } = useAuth();
  const { showFirstSignupModal, setShowFirstSignupModal } = useExam();

  const [universities, setUniversities] = useState([]);
  const [error, setError] = useState("");
  const [nickname, setNickName] = useState("");
  const universityRef = useRef();
  const yearRef = useRef();

  useEffect(() => {
    // fetch list of universities from api
    fetch(
      "https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json"
    )
      .then((resp) => resp.json())
      .then((uniList) => {
        setUniversities([
          "TU Delft",
          ...uniList.map((uni) => uni.name).slice(0, 20),
        ]);
      });
  }, []);

  const handleSubmit = () => {
    if (nickname == "") {
      setError("Please enter a pseudonym");
      return;
    }

    const university = universityRef.current.value;
    const year = yearRef.current.value;
    updateEducationalInformation({
      user: { id: user._id },
      university,
      education_year: year,
      nickname: nickname,
    });
    setShowFirstSignupModal(false);
  };

  if (!showFirstSignupModal) return;

  return (
    <div className="fixed w-[100vw] z-[9998] h-[100vh] top-0 left-0 flex items-center justify-center h-screen bg-[rgba(0,0,0,0.4)] backdrop-blur">
      <div className="relative z-[9999] w-[60vw] h-[50vh] max-w-[1200px] transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
        <div className="flex h-full flex-col bg-white py-6 shadow-xl overflow-hidden pt-10 pl-3">
          <div className="px-4 sm:px-6 ">
            <div className="flex items-start justify-between">
              <h2 className="leading-6 text-gray-900 font-extrabold text-2xl ">
                First signup
              </h2>
              <div className="ml-3 flex h-7 items-center">
                <button
                  type="button"
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={() => setShowFirstSignupModal(false)}
                >
                  <span className="sr-only">Close panel</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          <span className="mt-2 truncate text-sm text-gray-500 ml-6">
            Please answer these fields before accessing to your first questions.
          </span>
          <div className="m-6">
            <div className="">
              <label
                for="nickname"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Pseudonym*
              </label>
              <div class="mt-2">
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  value={nickname}
                  onChange={(e) => setNickName(e.currentTarget.value)}
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Choose a pseudonym"
                />
              </div>
            </div>
            {error && (
              <p class="text-sm leading-6 text-red-600 ml-1">{error}</p>
            )}
            <div className="mt-5">
              <label
                for="university"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                University*
              </label>
              <select
                id="university"
                name="university"
                ref={universityRef}
                class="mt-2 block w-[150px] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 font-bold ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {universities.map((uni) => (
                  <option key={uni}>{uni}</option>
                ))}
              </select>
            </div>
            <div className="mt-5">
              <label
                for="year"
                class="block text-sm font-medium leading-6 text-gray-900"
              >
                Year of study*
              </label>
              <select
                id="year"
                name="year"
                ref={yearRef}
                class="mt-2 block w-[150px] rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 font-bold ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option>D1</option>
                <option>D2</option>
                <option>D3</option>
                <option>D4</option>
              </select>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              class="rounded-md bg-[#7F56D9] px-3.5 py-2.5 w-full mt-10 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
