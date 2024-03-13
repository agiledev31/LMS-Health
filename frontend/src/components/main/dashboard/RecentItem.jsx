import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

function RecentItem({
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
    <div onClick={action} className="flex items-center px-4 py-1 gap-1 w-fit rounded-lg font-medium text-lg border-2 border-gray-300 text-gray-600 hover:font-semibold hover:border-primary-600 hover:text-primary-600 hover:cursor-pointer hover:bg-primary-100 click-action">
      {children}
      {withDeleteIcon && (
        <XMarkIcon onClick={deleteAction} className="w-5 h-4 hover:h-5" />
      )}
    </div>
  );
}

export default RecentItem;
