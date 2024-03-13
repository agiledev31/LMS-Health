import React, { useState } from "react";
import Search from "../../Search";
import MatiereCard from "./MatiereCard";
import { Spinner } from "../../../icons/Spinner";
import useAuthHttpClient from "../../../../hooks/useAuthHttpClient";
import { useAuth } from "../../../../providers/authProvider";
import EditableMatiereCard from "./EditableMatiereCard";
import { PlusIcon, PhotoIcon } from "@heroicons/react/24/outline";
import Modal from "../../../common/Modal";
import { useData } from "../../../../providers/learningDataProvider";
import SearchField from "../../SearchField";

function Matieres() {
  const { user } = useAuth();
  const { loading, matieres: allMatieres, setMatieres } = useData();
  const authHttpClient = useAuthHttpClient();
  const [openNewMatiereModal, setOpenNewMatiereModal] = useState(false);
  const [openEditMatiereModal, setOpenEditMatiereModal] = useState(false);
  const [openDeleteConfirmModal, setOpenDeleteConfirmModal] = useState(false);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [searchText, setSearchText] = useState("");

  const matieres = (
    searchText === ""
      ? allMatieres
      : allMatieres.filter(({ name }) =>
          name.toLowerCase().includes(searchText.toLowerCase())
        )
  ).sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  const AddNewMatiereModal = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [imageBuffer, setImageBuffer] = useState();
    const [name, setName] = useState("");
    const handleSubmit = async (e) => {
      setIsUploading(true);
      try {
        const response = await authHttpClient.post("/matiere", {
          name,
          image: imageBuffer,
        });
        setIsUploading(false);
        setOpenNewMatiereModal(false);
        console.log(response.data.data);
        setMatieres([...matieres, response.data.data]);
      } catch (error) {
        console.log(error);
      }
    };
    const convert = (e) => {
      // setFiles(e.target.files);
      if (e.target.files[0].size > 2000000) {
        console.log("File too large");
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = () => {
        setImageBuffer(reader.result);
        console.log(typeof reader.result);
      };
      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    };

    return (
      <Modal open={openNewMatiereModal} setOpen={setOpenNewMatiereModal}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[400px]">
          <label
            htmlFor="matiere"
            className="block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Matiere name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="matiere"
              id="matiere"
              autoComplete="matiere"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
          <label
            htmlFor="cover-photo"
            className="mt-4 block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Matiere Image
          </label>
          <div className="flex flex-col gap-2 justify-center items-center">
            {imageBuffer ? (
              <img
                className="mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 h-32"
                alt="Matiere"
                src={imageBuffer}
              />
            ) : (
              <div className="mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 w-60 h-32">
                <PhotoIcon
                  className="mx-auto h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
              </div>
            )}
            <div className="flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative h-fit cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500 px-2"
              >
                <span>Upload an image file</span>
                <input
                  accept="image/*"
                  onChange={convert}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
            </div>
          </div>
          <div className="mt-4 flex flex-row-reverse">
            <button
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {isUploading && <Spinner small />}Add Matiere
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const EditMatiereModal = () => {
    const [isUploading, setIsUploading] = useState(false);
    const handleSubmit = async (e) => {
      setIsUploading(true);
      try {
        const response = await authHttpClient.put(
          `/matiere/${selectedMatiere._id}`,
          selectedMatiere
        );
        setIsUploading(false);
        setOpenEditMatiereModal(false);
        console.log(response.data.data);
        setMatieres((matieres) => {
          return matieres.map((matiere) => {
            if (matiere._id === selectedMatiere._id) {
              return selectedMatiere;
            } else {
              return matiere;
            }
          });
        });
      } catch (error) {
        console.log(error);
      }
    };
    const convert = (e) => {
      // setFiles(e.target.files);
      if (e.target.files[0].size > 2000000) {
        console.log("File too large");
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);

      reader.onload = () => {
        const imageBuffer = reader.result;
        setSelectedMatiere((matiere) => {
          return {
            ...matiere,
            image: imageBuffer,
          };
        });
      };
      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    };

    return (
      <Modal open={openEditMatiereModal} setOpen={setOpenEditMatiereModal}>
        <div className="mt-20 p-6 border-2 border-gray-500 rounded-lg bg-white sm:w-[400px]">
          <label
            htmlFor="matiere"
            className="block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Matiere name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="matiere"
              id="matiere"
              autoComplete="matiere"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
              value={selectedMatiere?.name}
              onChange={(e) => {
                setSelectedMatiere((matiere) => ({
                  ...matiere,
                  name: e.target.value,
                }));
              }}
            />
          </div>
          <label
            htmlFor="cover-photo"
            className="mt-4 block text-sm font-medium leading-6 text-gray-900 text-left"
          >
            Matiere Image
          </label>
          <div className="flex flex-col gap-2 justify-center items-center">
            {selectedMatiere?.image ? (
              <img
                className="mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 h-32"
                alt="Matiere"
                src={selectedMatiere.image}
              />
            ) : (
              <div className="mt-2 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 w-60 h-32">
                <PhotoIcon
                  className="mx-auto h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
              </div>
            )}
            <div className="flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative h-fit cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500 px-2"
              >
                <span>Upload an image file</span>
                <input
                  accept="image/*"
                  onChange={convert}
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                />
              </label>
            </div>
          </div>
          <div className="mt-4 flex flex-row-reverse">
            <button
              onClick={() => {
                handleSubmit();
              }}
              type="button"
              className="click-action inline-flex justify-between border border-gray-300 items-center gap-x-1.5 rounded-md bg-primary-600 text-white px-2.5 py-1.5 text-sm font-semibol focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              {isUploading && <Spinner small />}Update Matiere
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  const DeleteConformModal = () => {
    const [deleting, setDeleting] = useState(false);
    const handleSubmit = async (e) => {
      setDeleting(true);
      try {
        await authHttpClient.delete(`/matiere/${selectedMatiere._id}`);
        setDeleting(false);
        setOpenDeleteConfirmModal(false);
        setMatieres((matieres) => {
          return matieres.filter(
            (matiere) => matiere._id !== selectedMatiere._id
          );
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
            Do you really want to delete this matiere?
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
  };

  return (
    <div>
      {loading ? (
        <div
          role="status"
          className="h-[70vh] pb-20 flex justify-center items-center"
        >
          <Spinner />
        </div>
      ) : (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
          {user.role === "user" && (
            <>
              <div className="mb-4 flex flex-row-reverse">
                <SearchField searchText={searchText} setSearchText={setSearchText} />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {matieres.map((matiere, index) => (
                  <MatiereCard key={index} matiere={matiere} />
                ))}
              </div>
            </>
          )}
          {user.role === "admin" && (
            <>
              <div className="mb-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setOpenNewMatiereModal(true);
                  }}
                  className="click-action inline-flex justify-between border-2 border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
                >
                  <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                  Add New Matiere
                </button>
                <SearchField searchText={searchText} setSearchText={setSearchText} />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {matieres.map((matiere, index) => (
                  <EditableMatiereCard
                    key={index}
                    matiere={matiere}
                    editAction={() => {
                      setSelectedMatiere(matiere);
                      setOpenEditMatiereModal(true);
                    }}
                    deleteAction={() => {
                      setSelectedMatiere(matiere);
                      setOpenDeleteConfirmModal(true);
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <AddNewMatiereModal />
      <EditMatiereModal />
      <DeleteConformModal />
    </div>
  );
}

export default Matieres;
