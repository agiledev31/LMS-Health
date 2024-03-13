import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import CopyIcon from "../icons/CopyIcon";
import { useQuiz } from "../../hooks/useQuiz";

function ShareLinkModal({ open, setOpen }) {
  const { currentQuestion, questionToShare, isShareDp } = useQuiz();
  const linkToShare = `${process.env.REACT_APP_URL}/quiz/${
    questionToShare._id
  }${isShareDp ? "/dp" : ""}`;
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-90 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-sm sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900 text-center"
                    >
                      Partager une SUPERQUESTION
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 text-center">
                        Demande de l’aide à tes amis ou partage une notion qui
                        te semble importante.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-2 mt-2">Share link</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="flex-1 border-2 border-solid rounded-lg px-2 py-1 overflow-auto inline-flex whitespace-nowrap text-primary-700 [&::-webkit-scrollbar]:hidden">
                    {linkToShare}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(linkToShare);
                    }}
                    className="text-gray-400 hover:cursor-pointer px-2 hover:text-gray-700 active:text-primary-700"
                  >
                    <CopyIcon className="text-gray-200" />
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default ShareLinkModal;
