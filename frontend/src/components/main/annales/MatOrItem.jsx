import React, { useState } from "react";
import { Link } from "react-router-dom";
import Label from "../../common/Label";
import {
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import Search from "../Search";
import Filter from "../Filter";
import Check from "../../common/Check";
import SearchField from "../SearchField";

function MatOrItem({ content }) {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg  divide-y-2 divide-gray-200">
        <div className="p-4 bg-white flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="-my-1 w-10 h-10 bg-gray-100 rounded-lg flex flex-col justify-end items-center">
              <img src="/assets/image/card3.svg" alt="card" />
            </div>
            {content.title}
            <div className="px-2 border-2 border-gray-400 rounded-md text-[12px] h-fit text-gray-700 font-semibold">
              {content.num_questions} questions
            </div>
          </div>
          <div className="flex items-center gap-2">
            {show ? (
              <ChevronUpIcon
                onClick={() => setShow((state) => !state)}
                className="w-5 h-5 stroke-2 hover:cursor-pointer hover:text-primary-600"
              />
            ) : (
              <ChevronDownIcon
                onClick={() => setShow((state) => !state)}
                className="w-5 h-5 stroke-2 hover:cursor-pointer hover:text-primary-600"
              />
            )}
            <EllipsisVerticalIcon className="w-5 h-5 stroke-2" />
          </div>
        </div>
        {show && (
          <>
            <div className="p-4 bg-white flex justify-between">
              <SearchField />
              <Filter />
            </div>
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="divide-y divide-gray-200 bg-white">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 flex items-center gap-2"
                  >
                    <div>Invoice</div>
                    <ArrowDownIcon className="w-4 h-4" />
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Last Assessed
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Matières
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Last score
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Test</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {content.dps.map((dp) => (
                  <tr key={dp.id} className="even:bg-gray-50">
                    <td className="whitespace-wrap font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 flex items-center gap-2">
                      <Check />
                      {dp.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {dp.lastAssessed}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {dp.item && <Label>{dp.item}</Label>}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {dp.matiere}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {dp.lastScore && `${dp.lastScore}/20`}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        // to="/quiz"
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilSquareIcon className="w-5 h-5 stroke-2" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}

export default MatOrItem;
