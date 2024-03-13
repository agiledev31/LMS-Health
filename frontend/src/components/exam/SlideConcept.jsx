import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function SlideConcept({ open, setOpen }) {
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
                          Diphtérie
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
                      <div className="text-sm">
                        Toxinfection responsables d’atteintes cardiaques et
                        neurologiques. Dûe à <i>Cornybacterium</i> diphteriae.
                      </div>
                {/* Separator */}
                <div className="my-6 block h-px w-full bg-gray-900/10" aria-hidden="true" />
                      <div className="font-bold text-gray-500">Subtitle</div>
                      <div className="text-sm text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Odio dictumst tempus magna elit cras posuere cursus
                        pulvinar id. Facilisis at eu amet ornare enim arcu
                        malesuada rutrum a.
                      </div>
                      <div className="my-4 p-4 rounded bg-gray-100 text-sm text-gray-500 font-extrabold">
                        <p>Déclaration obligatoire <span className="font-thin">à l’ARS</span> si toxines</p>
                        <p>Vaccination immédiate <span className="font-thin">dans les suites</span></p>
                      </div>
                      <img src="/assets/image/image1.png" alt="Aspect d’une angine à diphtérie"/>
                      <i className="text-gray-500">Aspect d’une angine à diphtérie</i>
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

export default SlideConcept;
