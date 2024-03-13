import { Link } from "react-router-dom";
import Search from "../../Search";
import Filter from "../../Filter";
import {
  ArrowDownIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import useAuthHttpClient from "../../../../hooks/useAuthHttpClient";
import { useAuth } from "../../../../providers/authProvider";
import Modal from "../../../common/Modal";
import { Spinner } from "../../../icons/Spinner";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox, Switch } from "@headlessui/react";
import QuestionForm from "./QuestionForm";
import SearchField from "../../SearchField";

const questionTypes = [
  { type: "Basic question", n: 5, modelType: "MultiChoice" },
  { type: "QROC", n: 3, modelType: "ShortAnswer" },
  { type: "Long question", n: 12, modelType: "MultiChoice" },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function DPs() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const authHttpClient = useAuthHttpClient();
  const [openNewItemModal, setOpenNewDPModal] = useState(false);
  const [openEditItemModal, setOpenEditItemModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [dps, setDps] = useState([]);
  const [selectedDp, setSelectedDp] = useState(null);
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const fetchDPs = async () => {
      try {
        const response = await authHttpClient.get("/dp");
        setDps(response.data.data);
        // setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDPs();
  }, []);

  const createDP = () => {
    var win = window.open("/addDP/", "_blank");
    win.focus();
  };

  const editDP = (id) => {
    var win = window.open(`/editDP/${id}`, "_blank");
    win.focus();
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      {user.role === "admin" && (
        <>
          <div className="inline-block min-w-full align-middle">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  createDP();
                }}
                className="click-action inline-flex justify-between border-2 border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
              >
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Add New DP
              </button>
              <div className="flex items-center space-x-2">
                <SearchField searchText={searchText} setSearchText={setSearchText} />
              </div>
            </div>
            <table className="my-4 min-w-full divide-y divide-gray-300 rounded-lg border-2 border-gray-400">
              <thead className="divide-y divide-gray-200 bg-white rounded">
                <tr>
                  <th
                    scope="col"
                    className="min-w-[80px] py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 flex items-center gap-2"
                  >
                    <div>ID</div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Session
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Matiere
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Item
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Delete</span>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Test</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {dps.map((dp) => (
                  <tr key={dp._id} className="even:bg-gray-50">
                    <td className="font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 gap-2">
                      {dp.dp_number}
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500 w-1/4 whitespace-nowrap  max-w-xs flex-auto truncate ">
                      {dp.desc}
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500">
                      {dp.session_id?.name}
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap">
                        {dp.matieres.map((matiere) => (
                          <div
                            key={matiere._id}
                            className="px-2 m-1 max-w-fit border border-gray-400 rounded-md text-[12px]"
                          >
                            {matiere.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className=" px-3 py-4 text-sm text-gray-500">
                      <div className="flex flex-wrap">
                        {dp.items.map((item) => (
                          <div
                            key={item._id}
                            className="px-2 m-1 max-w-fit border border-gray-400 rounded-md text-[12px]"
                          >
                            {`${item.item_number}. ${item.name}`}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="relative  py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        href="#"
                        onClick={() => {
                          setSelectedDp(dp);
                          setOpenDeleteConfirmModal(true);
                        }}
                        className="text-red-600 hover:text-primary-900"
                      >
                        <TrashIcon className="w-5 h-5 stroke-2" />
                      </Link>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link
                        onClick={() => {
                          editDP(dp._id);
                        }}
                        // to={`/editDP/${dp._id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <PencilSquareIcon className="w-5 h-5 stroke-2" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* <AddNewDPModal /> */}
          {/* <EditItemModal /> */}
          <DeleteConformModal />
        </>
      )}
    </div>
  );

  function DeleteConformModal() {
    const [deleting, setDeleting] = useState(false);
    const handleSubmit = async (e) => {
      setDeleting(true);
      try {
        await authHttpClient.delete(`/dp/${selectedDp._id}`);
        setDeleting(false);
        setOpenDeleteConfirmModal(false);
        setDps((questions) => {
          return questions.filter((item) => item._id !== selectedDp._id);
        });
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <Modal open={openDeleteConfirmModal} setOpen={setOpenDeleteConfirmModal}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[400px]">
          <label
            htmlFor="matiere"
            className="block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Do you really want to delete this DP?
          </label>
          <div className="mt-4 flex flex-row-reverse">
            <button
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-red-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {deleting && <Spinner small />} Delete
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}
