import Pagination from "../../Pagination";
import Search from "../../Search";
import Filter from "../../Filter";
import {
  ArrowDownIcon,
  Bars3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  EllipsisVerticalIcon,
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
import { useData } from "../../../../providers/learningDataProvider";
import SearchField from "../../SearchField";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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
export default function Tags() {
  const authHttpClient = useAuthHttpClient();
  const { tags: allTags, setTags, loading } = useData();
  const [openNewTagModal, setOpenNewTagModal] = useState(false);
  const [openEditTagModal, setOpenEditTagModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const [searchText, setSearchText] = useState("");
  const tags =
    searchText === ""
      ? allTags
      : allTags.filter(({ name }) =>
          name.toLowerCase().includes(searchText.toLowerCase())
        );
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="inline-block min-w-full align-middle">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => {
              setOpenNewTagModal(true);
            }}
            className="click-action inline-flex justify-between border-2 border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Add New Tag
          </button>
          <div className="flex items-center space-x-2">
            <SearchField searchText={searchText} setSearchText={setSearchText} />
          </div>
        </div>
        {tags.map((tag, index) => (
          <EditableTag
            index={index}
            tag={tag}
            editAction={() => {
              setSelectedTag(tag);
              setOpenEditTagModal(true);
            }}
          />
        ))}
      </div>
      <AddNewTag />
      <EditTagModal />
    </div>
  );

  function AddNewTag() {
    const [isUploading, setIsUploading] = useState(false);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");

    const handleSubmit = async (e) => {
      setIsUploading(true);
      try {
        const response = await authHttpClient.post("/tag", {
          name,
          desc,
        });
        setIsUploading(false);
        setOpenNewTagModal(false);
        setTags([
          ...tags,
          {
            _id: response.data.data._id,
            name,
            desc,
            n_questions: 0,
          },
        ]);
      } catch (error) {
        setIsUploading(false);
        console.log(error);
      }
    };

    return (
      <Modal open={openNewTagModal} setOpen={setOpenNewTagModal}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[400px]">
          <label
            htmlFor="tag"
            className="mt-2 block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            New Tag
          </label>
          <input
            type="text"
            name="tag"
            id="tag"
            autoComplete="tag"
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={name}
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            name="description"
            id="description"
            autoComplete="description"
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={desc}
            placeholder="Description"
            onChange={(e) => {
              setDesc(e.target.value);
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
              {isUploading && <Spinner small />}Upload Tag
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  function EditTagModal() {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [name, setName] = useState(selectedTag?.name);
    const [desc, setDesc] = useState(selectedTag?.desc);

    const updateTag = async (e) => {
      setIsUpdating(true);
      try {
        await authHttpClient.put(`/tag/${selectedTag._id}`, {
          name,
          desc,
        });
        setIsUpdating(false);
        setOpenEditTagModal(false);
        setTags(
          tags.map((tag) => {
            if (tag._id === selectedTag._id)
              return {
                ...tag,
                name: name,
                desc: desc,
              };
            return tag;
          })
        );
      } catch (error) {
        setIsUpdating(false);
        console.log(error);
      }
    };
    const deleteTag = async (e) => {
      setIsDeleting(true);
      try {
        await authHttpClient.delete(`/tag/${selectedTag._id}`);
        setIsDeleting(false);
        setOpenEditTagModal(false);
        setTags(tags.filter((tag) => tag._id !== selectedTag._id));
      } catch (error) {
        setIsDeleting(false);
        console.log(error);
      }
    };
    return (
      <Modal open={openEditTagModal} setOpen={setOpenEditTagModal}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[400px]">
          <label
            htmlFor="tag"
            className="mt-2 block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Edit Tag
          </label>
          <input
            type="text"
            name="tag"
            id="tag"
            autoComplete="tag"
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={name}
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <input
            type="text"
            name="description"
            id="description"
            autoComplete="description"
            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={desc}
            placeholder="Description"
            onChange={(e) => {
              setDesc(e.target.value);
            }}
          />
          <div className="mt-4 flex flex-row-reverse justify-between gap-2">
            <button
              onClick={() => {
                updateTag();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {isUpdating && <Spinner small />}Update Tag
            </button>
            <button
              onClick={() => {
                deleteTag();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-red-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {isDeleting && <Spinner small />}Delete Tag
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  function EditableTag({ tag, index, editAction }) {
    return (
      <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg  divide-y-2 divide-gray-200">
        <div className="p-4 bg-white flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Label color={colors[index % colors.length]}>{tag.name}</Label>
            <div className="px-2 min-w-fit border-2 border-gray-400 rounded-md text-[12px] h-fit text-gray-700 font-semibold">
              {tag.n_questions} questions
            </div>
            {tag.desc}
          </div>
          <div className="flex items-center gap-2">
            <div
              onClick={editAction}
              className="rounded-lg hover:outline hover:outline-2 hover:cursor-pointer outline-primary-600"
            >
              <EllipsisVerticalIcon className="w-5 h-5 stroke-2" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
