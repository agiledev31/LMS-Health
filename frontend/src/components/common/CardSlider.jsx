import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useCard } from "../../providers/cardProvider";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { Spinner } from "../icons/Spinner";
import HTMLReactParser from "html-react-parser";

function CardSlider() {
  const authHttpClient = useAuthHttpClient();
  const { openCard, setOpenCard, card: cardWithOutContent } = useCard();

  const [card, setCard] = useState();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchCard = async () => {
      try {
        const response = await authHttpClient.get(
          `/card/${cardWithOutContent._id}`
        );
        setCard(response.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    cardWithOutContent && fetchCard();
  }, [cardWithOutContent]);

  return (
    <Transition.Root show={openCard} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpenCard}>
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
                  {card && (
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="leading-6 text-gray-900 font-extrabold text-lg">
                            {card.name}
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                              onClick={() => setOpenCard(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-6">
                        {isLoading ? (
                          <Spinner />
                        ) : (
                          HTMLReactParser(card.content)
                        )}
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default CardSlider;
