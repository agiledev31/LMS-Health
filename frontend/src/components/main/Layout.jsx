import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useAuth } from "../../providers/authProvider";
import { HttpStatusCode } from "axios";
import { useExam } from "../../providers/examProvider";

export default function Layout({
  Sidebar,
  children,
  setShowCreateTestModal,
  setShowCreateAnnaleTestModal,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [title, setTitle] = useState("");
  const { resumeSession, resumeLastSession } = useExam();

  useEffect(() => {
    switch (location.pathname) {
      case "/": {
        setTitle("Dashboard");
        break;
      }
      case "/library/": {
        setTitle("Library");
        break;
      }
      case "/annales/": {
        setTitle("Annales");
        break;
      }
      case "/planner/": {
        setTitle("Planner");
        break;
      }
      case "/playlists/": {
        setTitle("Playlists");
        break;
      }
      case "/toolbox/": {
        setTitle("Toolbox");
        break;
      }
      default: {
        setTitle("");
      }
    }
  }, [location.pathname]);
  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <Sidebar
                  setShowCreateTestModal={setShowCreateTestModal}
                  setShowCreateAnnaleTestModal={setShowCreateAnnaleTestModal}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <Sidebar />
      </div>
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">
          {title}
        </div>
      </div>
      <main className="py-10 lg:pl-72">
        {resumeSession && (
          <div
            onClick={resumeLastSession}
            className="fixed bottom-[25px] right-[25px] m-4 z-[99999999]"
          >
            <div className="with-tooltip relative flex items-center justify-center">
              <button
                className="w-[4rem] h-[4rem] bg-black text-white rounded transition duration-300 rounded-full"
                // onClick={saveExam}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="m-auto"
                >
                  <path
                    d="M5 4.98963C5 4.01847 5 3.53289 5.20249 3.26522C5.37889 3.03203 5.64852 2.88773 5.9404 2.8703C6.27544 2.8503 6.67946 3.11965 7.48752 3.65835L18.0031 10.6687C18.6708 11.1139 19.0046 11.3364 19.1209 11.6169C19.2227 11.8622 19.2227 12.1378 19.1209 12.3831C19.0046 12.6636 18.6708 12.8862 18.0031 13.3313L7.48752 20.3417C6.67946 20.8804 6.27544 21.1497 5.9404 21.1297C5.64852 21.1123 5.37889 20.968 5.20249 20.7348C5 20.4671 5 19.9815 5 19.0104V4.98963Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <span className="tooltip-text absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs p-2 rounded shadow-lg w-[140px] text-center">
                Resume your last session
              </span>
            </div>
          </div>
        )}
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
