import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

import useAuthHttpClient from "../../../../hooks/useAuthHttpClient";
import { useData } from "../../../../providers/learningDataProvider";

import Search from "../../Search";
import Label from "../../../common/Label";
import Modal from "../../../common/Modal";
import { Spinner } from "../../../icons/Spinner";
import SearchField from "../../SearchField";

const colors = [
  "primary",
  "red",
  "green",
  "grayBlue",
  "orange",
  "gray",
  "blue",
  "indigo",
  "pink",
  "success",
  "lightBlue",
  "purple",
];
export default function Sessions() {
  const authHttpClient = useAuthHttpClient();
  const { sessions: allSessions, setSessions } = useData();
  const [openNewSessionModal, setOpenNewSessionModal] = useState(false);
  const [openEditSessionModal, setOpenEditSessionModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const [searchText, setSearchText] = useState("");
  const sessions =
    searchText === ""
      ? allSessions
      : allSessions.filter(({ name }) =>
          name.toLowerCase().includes(searchText.toLowerCase())
        );

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="inline-block min-w-full align-middle">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              setOpenNewSessionModal(true);
            }}
            className="click-action inline-flex justify-between border-2 border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Add New Session
          </button>
          <div className="flex items-center space-x-2">
            <SearchField searchText={searchText} setSearchText={setSearchText} />
          </div>
        </div>
        {sessions.map((session, index) => (
          <EditableSession
            index={index}
            session={session}
            editAction={() => {
              setSelectedSession(session);
              setOpenEditSessionModal(true);
            }}
          />
        ))}
      </div>
      <AddNewSessionModal />
      <EditSessionModal />
    </div>
  );

  function AddNewSessionModal() {
    const [isUploading, setIsUploading] = useState(false);
    const [name, setName] = useState("");

    const handleSubmit = async (e) => {
      setIsUploading(true);
      try {
        const response = await authHttpClient.post("/session", {
          name,
        });
        setIsUploading(false);
        setOpenNewSessionModal(false);
        setSessions([
          ...sessions,
          {
            _id: response.data.data._id,
            name,
            n_dps: 0,
            n_questions: 0,
          },
        ]);
      } catch (error) {
        setIsUploading(false);
        console.log(error);
      }
    };

    return (
      <Modal open={openNewSessionModal} setOpen={setOpenNewSessionModal}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[600px]">
          <label
            htmlFor="session"
            className="mt-2 block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            New Session
          </label>
          <input
            type="text"
            name="session"
            id="session"
            autoComplete="session"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={name}
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <div className="mt-4 flex flex-row-reverse">
            <button
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {isUploading && <Spinner small />}Add Session
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  function EditSessionModal() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [name, setName] = useState(selectedSession?.name);

    const updateSession = async (e) => {
      setIsUpdating(true);
      try {
        await authHttpClient.put(`/session/${selectedSession._id}`, {
          name,
        });
        setIsUpdating(false);
        setOpenEditSessionModal(false);
        setSessions(
          sessions.map((session) => {
            if (session._id === selectedSession._id)
              return {
                ...session,
                name,
              };
            return session;
          })
        );
      } catch (error) {
        setIsUpdating(false);
        console.log(error);
      }
    };
    const deleteSession = async (e) => {
      setIsDeleting(true);
      try {
        await authHttpClient.delete(`/session/${selectedSession._id}`);
        setIsDeleting(false);
        setOpenEditSessionModal(false);
        setSessions(
          sessions.filter((session) => session._id !== selectedSession._id)
        );
      } catch (error) {
        setIsDeleting(false);
        console.log(error);
      }
    };
    return (
      <Modal open={openEditSessionModal} setOpen={setOpenEditSessionModal}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[600px]">
          <label
            htmlFor="session"
            className="mt-2 block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            New Session
          </label>
          <input
            type="text"
            name="session"
            id="session"
            autoComplete="session"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={name}
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <div className="mt-4 flex flex-row-reverse gap-2">
            <button
              onClick={() => {
                updateSession();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {isUpdating && <Spinner small />}Update Session
            </button>
            <button
              onClick={() => {
                deleteSession();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-red-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {isDeleting && <Spinner small />}Delete Session
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  function EditableSession({ session, index, editAction }) {
    const [show, setShow] = useState(false);
    return (
      <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg  divide-y-2 divide-gray-200">
        <div className="p-4 bg-white flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Label color={colors[index % colors.length]}>{session.name}</Label>
            <div className="px-2 border-2 border-gray-400 rounded-md text-[12px] h-fit text-gray-700 font-semibold">
              {session.n_dps} dps
            </div>
            <div className="px-2 border-2 border-gray-400 rounded-md text-[12px] h-fit text-gray-700 font-semibold">
              {session.n_questions} questions
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
            <div
              onClick={editAction}
              className="rounded-lg hover:outline hover:outline-2 hover:cursor-pointer outline-primary-600"
            >
              <EllipsisVerticalIcon className="w-5 h-5 stroke-2" />
            </div>
          </div>
        </div>
        {show && (
          <>
            {/* <div className="p-4 bg-white flex justify-between gap-2">
              <div className="flex gap-2">
                <Search />
                <Filter />
              </div>
              <button
                type="button"
                // onClick={() => {
                //   setOpenNewSessionModal(true);
                // }}
                className="click-action inline-flex justify-between border-2 border-gray-400 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
              >
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Add New DP
              </button>
            </div> */}
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
                {session.dps?.map((dp) => (
                  <tr key={dp.dp_number} className="even:bg-gray-50">
                    <td className="whitespace-wrap font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 flex items-center gap-2">
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
                        className="text-indigo-600 hover:text-indigo-900"
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
    );
  }
}
