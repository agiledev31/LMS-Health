import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useNotification } from "../../providers/notificationProvider";

function Notification() {
  const { openNotification, setOpenNotification, notificationText } =
    useNotification();
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:p-12 z-50"
    >
      <div className="flex w-full flex-col items-center space-y-4">
        {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
        <Transition
          show={openNotification}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5">
            <div className="p-2">
              <div className="flex relative p-4">
                <div className="flex flex-col w-0 flex-1 justify-between">
                  <p className="text-sm font-medium text-gray-900 whitespace-pre-line">
                    {notificationText}
                  </p>
                </div>
                <div className="absolute top-0 right-0">
                  <button
                    type="button"
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenNotification(false);
                    }}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}

export default Notification;
