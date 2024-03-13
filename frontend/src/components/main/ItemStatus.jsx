import { Fragment, useState } from "react";
import { Popover, Transition } from "@headlessui/react";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useAuth } from "../../providers/authProvider";
import { Spinner, TinySpinner } from "../icons/Spinner";

const options = [
  {
    value: "done",
    label: "Fait",
    style: "bg-success-50 border-success-200 text-success-700",
  },
  {
    value: "todo",
    label: "À faire",
    style: "bg-red-50 border-red-200 text-red-700",
  },
  {
    value: "in progress",
    label: "En cours",
    style: "bg-primary-50 border-primary-200 text-primary-700",
  },
  {
    value: undefined,
    label: "Pas de statut",
    style:
      "bg-transparent border-transparent text-transparent hover:bg-gray-50 hover:border-gray-200 hover:text-gray-400",
  },
];
export const ItemStatus = ({
  status,
  setItems,
  status_id,
  item_id,
  itemIndex,
}) => {
  const authHttpClient = useAuthHttpClient();
  const { user } = useAuth();
  const { label, style } = options.find(({ value }) => value === status);
  const [isModifying, setIsModifying] = useState(false);

  const setStatus = (value) => {
    console.log(status, "->", value);

    const delectStatus = async () => {
      setIsModifying(true);
      await authHttpClient.delete(`/status/${status_id}`);
      setItems((items) => {
        const tempItems = JSON.parse(JSON.stringify(items));
        delete tempItems[itemIndex].status;
        delete tempItems[itemIndex].status_id;
        return tempItems;
      });
      setIsModifying(false);
    };
    const updateStatus = async () => {
      setIsModifying(true);
      await authHttpClient.put(`/status/${status_id}`, {
        user_id: user._id,
        item_id,
        status: value,
      });
      setItems((items) => {
        const tempItems = JSON.parse(JSON.stringify(items));
        tempItems[itemIndex].status = value;
        tempItems[itemIndex].status_id = status_id;
        return tempItems;
      });
      setIsModifying(false);
    };
    const createStatus = async () => {
      setIsModifying(true);
      const response = await authHttpClient.post("/status", {
        user_id: user._id,
        item_id,
        status: value,
      });
      setItems((items) => {
        const tempItems = JSON.parse(JSON.stringify(items));
        tempItems[itemIndex].status = value;
        tempItems[itemIndex].status_id = response.data.data._id;
        return tempItems;
      });
      setIsModifying(false);
    };

    if (value !== status) {
      if(!value) delectStatus();
      else if(!status) createStatus();
      else updateStatus();
    }
  };
  
  return (
    <Popover as="div" className="relative w-full inline-block text-left">
      <div>
        {isModifying ? (
          <TinySpinner />
        ) : (
          <Popover.Button
            className={`group font-medium px-2 rounded-full border-2 justify-center items-center gap-2 click-action flex ${style}`}
          >
            <span>{label}</span>
          </Popover.Button>
        )}
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="space-y-1">
            {options.map((option, optionIdx) => (
              <div
                key={optionIdx}
                className={`flex items-center rounded-md py-1 hover:bg-gray-100 hover:cursor-pointer ${
                  option.value === status && "text-primary-600 bg-gray-100"
                }`}
                onClick={() => {
                  setStatus(option.value);
                }}
              >
                <span
                  className={`ml-3 whitespace-nowrap pr-6 text-sm font-extrabold`}
                >
                  {option.label}
                </span>
              </div>
            ))}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};
