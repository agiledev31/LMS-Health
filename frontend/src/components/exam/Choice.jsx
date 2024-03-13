import React, { Fragment, useState } from "react";

import Check from "../common/Check";
import { Transition } from "@headlessui/react";
import MessageAlertIcon from "../icons/MessageAlertIcon";

function Choice({
  label,
  content,
  checked,
  clickAction,
  desc,
  answered,
  isRight,
}) {
  const { borderColor, bgColor } = answered
    ? isRight
      ? { borderColor: "border-green-dark", bgColor: "bg-green-bg" }
      : checked
      ? { borderColor: "border-red-dark", bgColor: "bg-red-bg" }
      : { borderColor: "border-gray-300", bgColor: "bg-white" }
    : { borderColor: "border-gray-300", bgColor: "bg-white" };

  const [dropdown, setDropdown] = useState(false);
  return (
    <div className="px-12 pb-3">
      <div
        className={`border-2 ${borderColor} ${bgColor} px-4 py-2 flex ${
          dropdown ? "rounded-t-lg border-b-0" : "rounded-lg"
        }`}
      >
        <div className="flex-1 flex gap-3">
          <span className="bg-gray-200 w-6 h-6 rounded-full text-gray-400 px-1 text-center font-bold">
            {label}
          </span>
          <div className="flex gap-3" onClick={clickAction}>
            <Check checked={checked} styleFill />
            {content}
          </div>
        </div>
        {answered && checked !== isRight && (
          <div>
            <MessageAlertIcon strokeWidth={3} />
          </div>
        )}
        {desc &&
          (dropdown ? (
            <i
              onClick={() => {
                setDropdown((state) => !state);
              }}
              className="ri-arrow-up-s-line"
            ></i>
          ) : (
            <i
              onClick={() => {
                setDropdown((state) => !state);
              }}
              className="ri-arrow-down-s-line"
            ></i>
          ))}
      </div>
      <Transition
        show={!!(dropdown && desc)}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={`${bgColor} ${borderColor} border-2 border-t-0 pl-12 pr-4 py-2 rounded-b-lg`}
        >
          {desc}
        </div>
      </Transition>
    </div>
  );
}

export default Choice;
