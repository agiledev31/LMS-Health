import { Link } from "react-router-dom";
import { ProgressBar } from "../../../common/ProgressBar";
import Pagination from "../../Pagination";
import Search from "../../Search";
import Filter from "../../Filter";
import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import useAuthHttpClient from "../../../../hooks/useAuthHttpClient";
import { useAuth } from "../../../../providers/authProvider";
import Label from "../../../common/Label";
import Modal from "../../../common/Modal";
import { Spinner } from "../../../icons/Spinner";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox, Switch } from "@headlessui/react";
import { useQuiz } from "../../../../hooks/useQuiz";
import { ItemStatus } from "../../ItemStatus";
import { ItemStatusFilter } from "../matiere/Overview";
import { useData } from "../../../../providers/learningDataProvider";
import SearchField from "../../SearchField";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Items() {
  const authHttpClient = useAuthHttpClient();
  const { user } = useAuth();
  const { setOpenTakeTestModal, setSelectedMatiere, setSelectedItem } =
    useQuiz();

  const { matieres } = useData();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openNewItemModal, setOpenNewItemModal] = useState(false);
  const [openEditItemModal, setOpenEditItemModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [selectedItem, selectItemForEdit] = useState(null);

  const [totalNumber, setTotalNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await authHttpClient.post(`/item/getPage`, {
          user_id: user._id,
          pageSize,
          pageNumber,
          searchText,
          filter,
          sort,
        });

        setTotalNumber(response.data.total_number);
        setItems(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, [pageSize, pageNumber, searchText, filter, sort]);

  const filterByStatus = (status) => {
    setFilter({ status: status });
  };

  const sortByNQuestion = () => {
    let tempSort = { ...sort };
    delete tempSort.n_questions;
    if (!sort?.n_questions) tempSort = { n_questions: 1, ...tempSort };
    else if (sort.n_questions === 1)
      tempSort = { n_questions: -1, ...tempSort };
    setSort(tempSort);
  };

  const sortByProgress = () => {
    let tempSort = { ...sort };
    delete tempSort.progress;
    if (!sort?.progress) tempSort = { progress: 1, ...tempSort };
    else if (sort.progress === 1) tempSort = { progress: -1, ...tempSort };
    setSort(tempSort);
  };

  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      {user.role === "user" && (
        <div className="inline-block min-w-full py-2 align-middle">
          <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg  divide-y-2 divide-gray-200">
            <div className="px-6 py-4 bg-white text-xl font-extrabold flex justify-between items-center sm:rounded-t-lg">
              Liste des items
              <SearchField
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </div>
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="divide-y divide-gray-200 bg-white">
                <tr>
                  <th
                    scope="col"
                    className="w-1/3 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <ItemStatusFilter
                      setStatus={filterByStatus}
                      status={filter.status}
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    <div
                      onClick={() => {
                        sortByNQuestion();
                      }}
                      className="hover:cursor-pointer hover:text-primary-600 flex items-center max-w-fit"
                    >
                      Number of questions
                      {!sort.n_questions && (
                        <ChevronUpDownIcon className="w-4 h-4 stroke-2" />
                      )}
                      {sort.n_questions && sort.n_questions === 1 && (
                        <ChevronDownIcon className="w-4 h-4 stroke-2" />
                      )}
                      {sort.n_questions && sort.n_questions === -1 && (
                        <ChevronUpIcon className="w-4 h-4 stroke-2" />
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    <div
                      onClick={() => {
                        sortByProgress();
                      }}
                      className="hover:cursor-pointer hover:text-primary-600 flex items-center max-w-fit"
                    >
                      Progress rate
                      {!sort.progress && (
                        <ChevronUpDownIcon className="w-4 h-4 stroke-2" />
                      )}
                      {sort.progress && sort.progress === 1 && (
                        <ChevronDownIcon className="w-4 h-4 stroke-2" />
                      )}
                      {sort.progress && sort.progress === -1 && (
                        <ChevronUpIcon className="w-4 h-4 stroke-2" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              {!isLoading && (
                <tbody className="divide-y divide-gray-200 bg-white">
                  {items.map((item, index) => (
                    <tr key={item._id}>
                      <td className="whitespace-wrap font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6 hover:text-primary-600 hover:cursor-pointer click-action">
                        <Link to={`/library/item/${item._id}`}>
                          {item.item_number}. {item.name}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <ItemStatus
                          status={item.status}
                          status_id={item.status_id}
                          setItems={setItems}
                          item_id={item._id}
                          itemIndex={index}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {item.n_questions} questions
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <ProgressBar
                          progress={
                            item.n_questions && item.progress
                              ? Math.round(
                                  (item.progress / item.n_questions) * 100
                                )
                              : 0
                          }
                        />
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          // to="/quiz"
                          onClick={() => {
                            setSelectedItem(item._id);
                            setSelectedMatiere(item.matiere_id);
                            setOpenTakeTestModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <PencilSquareIcon className="w-5 h-5 stroke-2" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
            {isLoading && (
              <div
                role="status"
                className="h-[70vh] flex justify-center items-center bg-white"
              >
                <Spinner />
              </div>
            )}
            <Pagination
              totalNumber={totalNumber}
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              pageSize={pageSize}
              setPageSize={setPageSize}
            />
          </div>
        </div>
      )}
      {user.role === "admin" && (
        <>
          <div className="inline-block min-w-full align-middle">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setOpenNewItemModal(true);
                }}
                className="click-action inline-flex justify-between border-2 border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
              >
                <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Add New Item
              </button>
              <div className="flex items-center space-x-2">
                <SearchField
                  searchText={searchText}
                  setSearchText={setSearchText}
                />
              </div>
            </div>
            {isLoading ? (
              <div
                role="status"
                className="h-[70vh] pb-20 flex justify-center items-center"
              >
                <Spinner />
              </div>
            ) : (
              items.map((item) => (
                <EditableItem
                  item={item}
                  editAction={() => {
                    selectItemForEdit(item);
                    setOpenEditItemModal(true);
                  }}
                  deleteAction={() => {
                    selectItemForEdit(item);
                    setOpenDeleteConfirmModal(true);
                  }}
                />
              ))
            )}
          </div>
          <Pagination
            totalNumber={totalNumber}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
          <AddNewItemModal />
          <EditItemModal />
          <DeleteConformModal />
        </>
      )}
    </div>
  );

  function AddNewItemModal() {
    const [query, setQuery] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [item_number, setNumber] = useState("");
    const [name, setName] = useState("");
    const [selectedMatiere, setSelectedMatiere] = useState(null);
    const [objects, setObjects] = useState([
      {
        title: "",
        isRankA: true,
      },
    ]);

    const filteredMatieres =
      query === ""
        ? matieres
        : matieres.filter((matiere) => {
            return matiere.name.toLowerCase().includes(query.toLowerCase());
          });

    const handleSubmit = async (e) => {
      setIsUploading(true);
      try {
        const response = await authHttpClient.post("/item", {
          item_number,
          name,
          matiere_id: selectedMatiere._id,
          n_questions: 0,
          objects,
        });
        setIsUploading(false);
        setOpenNewItemModal(false);
        console.log(response.data.data);
        setItems([
          ...items,
          {
            _id: response.data.data.id,
            item_number,
            name,
            matiere_id: selectedMatiere,
            n_questions: 0,
            objects,
          },
        ]);
      } catch (error) {
        setIsUploading(false);
        console.log(error);
      }
    };
    return (
      <Modal open={openNewItemModal} setOpen={setOpenNewItemModal}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[600px]">
          <Combobox
            as="div"
            value={selectedMatiere}
            onChange={setSelectedMatiere}
          >
            <Combobox.Label className="text-left block text-sm font-medium leading-6 text-gray-900">
              Select Matiere
            </Combobox.Label>
            <div className="relative mt-2">
              <Combobox.Input
                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(matiere) => matiere?.name}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>

              {filteredMatieres.length > 0 && (
                <Combobox.Options className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredMatieres.map((matiere) => (
                    <Combobox.Option
                      key={matiere._id}
                      value={matiere}
                      className={({ active }) =>
                        classNames(
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                          active ? "bg-primary-600 text-white" : "text-gray-900"
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <div className="flex items-center">
                            <img
                              src={matiere.image}
                              alt={matiere.name}
                              className="h-6 w-6 flex-shrink-0 rounded-full"
                            />
                            <span
                              className={classNames(
                                "ml-3 truncate",
                                selected && "font-semibold"
                              )}
                            >
                              {matiere.name}
                            </span>
                          </div>

                          {selected && (
                            <span
                              className={classNames(
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                active ? "text-white" : "text-primary-600"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}
            </div>
          </Combobox>
          <label
            htmlFor="item"
            className="mt-2 block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Item
          </label>
          <div className="my-2 flex gap-2">
            <input
              type="text"
              name="item"
              id="item"
              autoComplete="item"
              className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={item_number}
              placeholder="Number"
              onChange={(e) => {
                setNumber(e.target.value);
              }}
            />
            <input
              type="text"
              name="item"
              id="item"
              autoComplete="item"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={name}
              placeholder="Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <label
            htmlFor="item"
            className="mt-2 block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Item Objects
          </label>
          {objects.map((object, idx) => (
            <ItemObjectInput
              object={object}
              setObjects={setObjects}
              last={idx === objects.length - 1}
              index={idx}
              key={idx}
            />
          ))}
          <div className="mt-4 flex flex-row-reverse">
            <button
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {isUploading && <Spinner small />}Add Item
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  function EditItemModal() {
    const [query, setQuery] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [item_number, setNumber] = useState(selectedItem?.item_number);
    const [name, setName] = useState(selectedItem?.name);
    const [selectedMatiere, setSelectedMatiere] = useState(
      matieres.find((matiere) => matiere._id === selectedItem?.matiere_id._id)
    );
    const [objects, setObjects] = useState(
      selectedItem?.objects ?? [
        {
          title: "",
          isRankA: true,
        },
      ]
    );

    useEffect(() => {
      setQuery("");
      setNumber(selectedItem?.item_number);
      setName(selectedItem?.name ?? "");
      setSelectedMatiere(
        matieres.find((matiere) => matiere._id === selectedItem?.matiere_id._id)
      );
      setObjects(
        selectedItem?.objects ?? [
          {
            title: "",
            isRankA: true,
          },
        ]
      );
    }, [selectedItem]);

    const filteredMatieres =
      query === ""
        ? matieres
        : matieres.filter((matiere) => {
            return matiere.name.toLowerCase().includes(query.toLowerCase());
          });

    const handleSubmit = async (e) => {
      setIsUploading(true);
      try {
        const response = await authHttpClient.put(`/item/${selectedItem._id}`, {
          item_number,
          name,
          matiere_id: selectedMatiere._id,
          n_questions: 0,
          objects,
        });
        setIsUploading(false);
        setOpenEditItemModal(false);
        console.log(response.data.data);
        setItems(
          items.map((item) => {
            if (item._id === selectedItem._id) {
              return {
                ...item,
                item_number,
                name,
                matiere_id: selectedMatiere,
                objects,
              };
            }
            return item;
          })
        );
      } catch (error) {
        setIsUploading(false);
        console.log(error);
      }
    };
    return (
      <Modal open={openEditItemModal} setOpen={setOpenEditItemModal}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[600px]">
          <Combobox
            as="div"
            value={selectedMatiere}
            onChange={setSelectedMatiere}
          >
            <Combobox.Label className="text-left block text-sm font-medium leading-6 text-gray-900">
              Select Matiere
            </Combobox.Label>
            <div className="relative mt-2">
              <Combobox.Input
                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(matiere) => matiere.name}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>

              {filteredMatieres.length > 0 && (
                <Combobox.Options className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredMatieres.map((matiere) => (
                    <Combobox.Option
                      key={matiere._id}
                      value={matiere}
                      className={({ active }) =>
                        classNames(
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                          active ? "bg-primary-600 text-white" : "text-gray-900"
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <div className="flex items-center">
                            <img
                              src={matiere.image}
                              alt={matiere.name}
                              className="h-6 w-6 flex-shrink-0 rounded-full"
                            />
                            <span
                              className={classNames(
                                "ml-3 truncate",
                                selected && "font-semibold"
                              )}
                            >
                              {matiere.name}
                            </span>
                          </div>

                          {selected && (
                            <span
                              className={classNames(
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                active ? "text-white" : "text-primary-600"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}
            </div>
          </Combobox>
          <label
            htmlFor="item"
            className="mt-2 block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Item
          </label>
          <div className="my-2 flex gap-2">
            <input
              type="text"
              name="item"
              id="item"
              autoComplete="item"
              className="block w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={item_number}
              placeholder="Number"
              onChange={(e) => {
                setNumber(e.target.value);
              }}
            />
            <input
              type="text"
              name="item"
              id="item"
              autoComplete="item"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={name}
              placeholder="Name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <label
            htmlFor="item"
            className="mt-2 block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Item Objects
          </label>
          {objects.map((object, idx) => (
            <ItemObjectInput
              object={object}
              setObjects={setObjects}
              last={idx === objects.length - 1}
              index={idx}
              key={idx}
            />
          ))}
          <div className="mt-4 flex flex-row-reverse">
            <button
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {isUploading && <Spinner small />}Update Item
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  function DeleteConformModal() {
    const [deleting, setDeleting] = useState(false);
    const handleSubmit = async (e) => {
      setDeleting(true);
      try {
        await authHttpClient.delete(`/item/${selectedItem._id}`);
        setDeleting(false);
        setOpenDeleteConfirmModal(false);
        setItems((items) => {
          return items.filter((item) => item._id !== selectedItem._id);
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
            Do you really want to delete this item?
          </label>
          <div className="mt-4 flex flex-row-reverse">
            <button
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {deleting && <Spinner small />} Delete
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  function ItemObjectInput({ index, object, setObjects, last, deleteAction }) {
    const switchIsRankA = (isRankA) => {
      setObjects((objects) =>
        objects.map((object, idx) => {
          if (index === idx) object.isRankA = isRankA;
          return object;
        })
      );
    };
    return (
      <div className="my-2">
        <div className="flex justify-between items-center">
          <div className="ml-4 flex gap-2 justify-center text-sm items-center">
            <span>Rang A</span>
            <Switch
              checked={object.isRankA}
              onChange={switchIsRankA}
              className="bg-primary-600 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className={classNames(
                  !object.isRankA ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                )}
              />
            </Switch>
            <span>B</span>
          </div>
          <div
            onClick={() => {
              if (last) {
                console.log("Last");
                setObjects((objects) => {
                  return [
                    ...objects,
                    {
                      title: "",
                      isRankA: true,
                    },
                  ];
                });
              } else {
                setObjects((objects) => {
                  return objects.filter((object, idx) => {
                    return index !== idx;
                  });
                });
              }
            }}
            className="click-action hover:outline hover:outline-2 outline-primary-600 rounded-lg hover:cursor-pointer"
          >
            {last ? (
              <PlusIcon className="w-6 h-6" />
            ) : (
              <XMarkIcon className="w-6 h-6" />
            )}
          </div>
        </div>
        <div className="text-left my-2 first:focus:border-primary-600">
          <input
            type="text"
            name="item"
            id="item"
            autoComplete="item"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={object.title}
            onChange={(e) => {
              setObjects((objects) =>
                objects.map((object, idx) => {
                  if (index === idx) object.title = e.target.value;
                  return object;
                })
              );
            }}
          />
        </div>
      </div>
    );
  }

  function EditableItem({ item, editAction, deleteAction }) {
    const [show, setShow] = useState(false);
    return (
      <>
        <div className="my-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg  divide-y-2 divide-gray-200">
          <div className="p-4 bg-white flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              {`${item.item_number}. ${item.name}`}
              <div className="px-2 border-2 border-gray-400 rounded-md text-[12px] h-fit text-gray-700 font-semibold">
                {item.matiere_id.name}
              </div>
              <div className="px-2 border-2 border-gray-400 rounded-md text-[12px] h-fit text-gray-700 font-semibold">
                {item.n_questions} questions
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={editAction}
                type="button"
                className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
              >
                Edit
                <Bars3Icon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              </button>
              <button
                onClick={deleteAction}
                type="button"
                className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
              >
                Delete
                <TrashIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              </button>
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
            </div>
          </div>
          {show && (
            <table className="min-w-full divide-y divide-gray-300">
              <tbody className="divide-y divide-gray-200 bg-white">
                {item?.objects.map(({ title, isRankA }, idx) => (
                  <tr key={idx}>
                    <td className="whitespace-wrap font-extrabold py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                      {title}
                    </td>
                    <td className="w whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {isRankA ? "Rang A" : "Rang B"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  }
}
