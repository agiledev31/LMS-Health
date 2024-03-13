import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useAuth } from "../../providers/authProvider";
import { Spinner } from "../icons/Spinner";

function SlideReport({ open, question_id, setOpen }) {
  const authHttpClient = useAuthHttpClient();
  const { user } = useAuth();
  const [sending, setSending] = useState(false);

  const send = () => {
    const report = document.getElementById("report").innerText;
    const sendReport = async () => {
      setSending(true);
      await authHttpClient.post("report", {
        user_id: user._id,
        question: question_id,
        report,
      });
      setSending(false);
      setOpen(false);
    };
    report && sendReport();
  };
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="leading-6 text-gray-900 font-extrabold text-lg">
                          Report a mistake
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="text-sm">Description</div>
                      <div className="my-2 first:focus:border-primary-600">
                        <span
                          id="report"
                          placeholder="Please specifiy why you contact us..."
                          className="empty:before:content-[attr(placeholder)] before:text-gray-400 p-2 block w-full min-h-[96px] border-2 rounded-md border-gray-400 focus-visible:outline-primary-600"
                          contentEditable
                        ></span>
                      </div>
                      <div className="flex flex-row-reverse">
                        <button
                          onClick={send}
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg w-20 flex justify-center items-center"
                        >
                          {sending ? <Spinner small center /> : "Send"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default SlideReport;
