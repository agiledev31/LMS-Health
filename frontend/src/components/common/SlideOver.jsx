import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import Label from "./Label";
import Check from "./Check";

function SlideOver({ open, setOpen }) {
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
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Playlists
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
                      <div className="mb-4">Custom labels</div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <Check />
                          <Label>Playlist 1</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check checked />
                          <Label>Playlist 2</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check checked />
                          <Label>Playlist 3</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check  />
                          <Label>Playlist 4</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check checked />
                          <Label>Playlist 5</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check checked />
                          <Label>Playlist 6</Label>
                        </div>
                        <div className="flex items-center gap-2 text-primary-600 hover:cursor-pointer">
                          <PlusIcon className="w-4 h-4 [&>path]:stroke-[3]"/>
                          Create a playlist
                        </div>
                        
                      </div>
                    </div>
                    <div className="flex p-4 gap-4 items-center">
                      <div className="flex-1 text-primary-600">
                        Manage playlists
                      </div>
                      <button className="px-4 py-2 border-[1px] rounded-lg">
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">
                        Apply
                      </button>
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

export default SlideOver;
