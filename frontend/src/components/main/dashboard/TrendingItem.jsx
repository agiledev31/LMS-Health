import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import TrendingUpIcon from "../../icons/TrendingUpIcon";

function TrendingItem({
  withIcon = true,
  withDeleteIcon = false,
  deleteAction = () => {
    console.log("delete tranding item");
  },
  action = () => {
    console.log("Go to ...");
  },
  children,
}) {
  return (
    <div
      onClick={action}
      className="flex items-center px-2 py-1 gap-1 w-fit rounded-lg font-medium bg-success-50 border-2 border-success-200 text-success-700 hover:font-bold hover:border-success-700 hover:cursor-pointer click-action"
    >
      {withIcon && <TrendingUpIcon className="w" />} {children}{" "}
      {withDeleteIcon && (
        <XMarkIcon onClick={deleteAction} className="w-5 h-4 hover:h-5" />
      )}
    </div>
  );
}

export default TrendingItem;
