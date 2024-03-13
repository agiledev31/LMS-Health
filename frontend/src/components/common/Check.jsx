import { CheckIcon } from "@heroicons/react/24/outline";
import React from "react";

function Check({checked, styleFill}) {
  if (checked)
    return (
      <div className={`rounded my-1 w-4 h-4 border-2 border-primary-700 ${styleFill?'bg-primary-700' :'bg-white'} text-primary-600 flex justify-center items-center font-bold`}>
        <CheckIcon className={`h-3 w-3 text-center [&>path]:stroke-[3] ${styleFill && 'text-white'}`}/>
      </div>
    );
  else
    return (
      <div className="rounded my-1 w-4 h-4 border-[1px] border-gray-400 flex justify-center items-center"></div>
    );
}

export default Check;
