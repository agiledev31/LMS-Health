import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import Label from "../common/Label";
import Check from "../common/Check";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useAuth } from "../../providers/authProvider";
import { Spinner, TinySpinner } from "../icons/Spinner";
import { useQuiz } from "../../hooks/useQuiz";
import { useNotification } from "../../providers/notificationProvider";

const colors = [
  "primary",
  "blue",
  "indigo",
  "pink",
  "success",
  "grayBlue",
  "lightBlue",
  "purple",
  "orange",
  "gray",
];
function SlidePlaylist({ open, setOpen }) {
  const authHttpClient = useAuthHttpClient();
  const { user } = useAuth();
  const { currentQuestion } = useQuiz();
  const [playlists, setPlaylists] = useState([]);
  const [search, setSearch] = useState("");
  const { showNotification } = useNotification();

  const filteredPlaylists =
    search === ""
      ? playlists
      : playlists.filter((playlist) =>
          playlist.name.toLowerCase().includes(search.toLowerCase())
        );
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    user_id: user.id,
    color: "primary",
  });
  const [toggled, setToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response1 = await authHttpClient.post("/playlist/filter", {
          user_id: user._id,
        });
        let allPlaylists;
        allPlaylists = response1.data.data;
        const response2 = await authHttpClient.post(
          "/playlist/filterQuestion",
          {
            user_id: user._id,
            question_id: currentQuestion,
          }
        );
        const temp = response2.data.data;
        setSavedQuestions(temp);
        setPlaylists(
          allPlaylists.map((playlist) => ({
            ...playlist,
            checked: temp.map((_) => _.playlist_id).includes(playlist._id),
          }))
        );
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlaylists();
  }, [currentQuestion]);

  const createPlayslist = async () => {
    setCreating(true);
    try {
      const response = await authHttpClient.post("/playlist/", {
        name: newPlaylist.name,
        user_id: user._id,
        color: newPlaylist.color,
      });
      setPlaylists([...playlists, response.data.data]);
      setNewPlaylist({
        name: "",
        user_id: user.id,
        color: "primary",
      });
      setCreating(false);
      setToggled(false);
      showCreatedSuccess(response.data.data.name);
    } catch (error) {
      setCreating(false);
      console.log(error);
    }
  };

  const showCreatedSuccess = (name) => {
    showNotification(`Playlist "${name}" is created successfully!`);
  };

  const applyPlaylistChange = async () => {
    setApplying(true);
    const playlistsToBeAdded = playlists.filter(
      (playlist) =>
        playlist.checked &&
        !savedQuestions
          .map(({ playlist_id }) => playlist_id)
          .includes(playlist._id)
    );
    const playlistsToBeRemoved = savedQuestions.filter(
      ({ playlist_id }) =>
        playlists.filter(({ _id, checked }) => checked && playlist_id === _id)
          .length === 0
    );
    try {
      for (let i = 0; i < playlistsToBeAdded.length; i++) {
        const response = await authHttpClient.post("/playlist/question", {
          user_id: user._id,
          question_id: currentQuestion,
          playlist_id: playlistsToBeAdded[i]._id,
        });
        setSavedQuestions((_) => [..._, response.data.data]);
      }
      for (let i = 0; i < playlistsToBeRemoved.length; i++) {
        await authHttpClient.delete(
          `/playlist/question/${playlistsToBeRemoved[i]._id}`
        );
        setSavedQuestions((_) =>
          _.filter(({ _id }) => {
            return _id !== playlistsToBeRemoved[i]._id;
          })
        );
      }
      setApplying(false);
      showApplyedSuccess();
    } catch (error) {
      console.log(error);
    }
  };

  const showApplyedSuccess = () => {
    showNotification(`Applied successfully!`);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Playlists
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="relative flex flex-1">
                        <label htmlFor="search-field" className="sr-only">
                          Search
                        </label>
                        <MagnifyingGlassIcon
                          className="pointer-events-none absolute inset-y-0 left-3 h-full w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <input
                          id="search-field"
                          className="block py-3 h-full w-full pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm  rounded-lg border-2 border-gray-400 focus:border-primary-600"
                          placeholder="Search for existing label"
                          type="search"
                          name="search"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                      <div className="mt-4 flex flex-col gap-3">
                        {isLoading ? (
                          <div className="flex mt-6 justify-center ">
                            <Spinner />
                          </div>
                        ) : (
                          <>
                            {filteredPlaylists.map(
                              ({ _id, name, checked, color }, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 max-w-fit"
                                  onClick={() => {
                                    setPlaylists((prevState) => {
                                      return prevState.map((playlist) => {
                                        if (playlist._id === _id) {
                                          return {
                                            ...playlist,
                                            checked: !checked,
                                          };
                                        }
                                        return playlist;
                                      });
                                    });
                                  }}
                                >
                                  <Check checked={checked} />
                                  <Label color={color}>{name}</Label>
                                </div>
                              )
                            )}
                            <div className="flex justify-between items-center">
                              <div
                                onClick={() => {
                                  setToggled((toggled) => !toggled);
                                }}
                                className="flex items-center gap-2 text-primary-600 hover:cursor-pointer"
                              >
                                <PlusIcon className="w-4 h-4 [&>path]:stroke-[3]" />
                                Create a playlist
                              </div>
                              {toggled && (
                                <div className="flex items-center gap-3 mr-2 text-primary-600">
                                  <XMarkIcon
                                    onClick={() => {
                                      setToggled(false);
                                    }}
                                    className="w-4 h-4 [&>path]:stroke-[3] hover:cursor-pointer"
                                  />
                                  {creating ? (
                                    <TinySpinner />
                                  ) : (
                                    <CheckIcon
                                      onClick={() => {
                                        createPlayslist();
                                      }}
                                      className="w-4 h-4 [&>path]:stroke-[3]  hover:cursor-pointer"
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                            {toggled && (
                              <div className="border-2 border-gray-300 rounded-lg p-2 items-center flex flex-col justify-center">
                                <input
                                  className={`my-2 appearance-none px-3 py-0 w-fit rounded-full border-2 text-center focus:border-primary-600
                              ring-0 placeholder:text-gray-400 focus:ring-inset focus:ring-0 text-sm leading-6
                              bg-${newPlaylist.color}-50 border-${newPlaylist.color}-200 text-${newPlaylist.color}-700`}
                                  value={newPlaylist.name}
                                  placeholder="Playlist name"
                                  onChange={(e) =>
                                    setNewPlaylist({
                                      ...newPlaylist,
                                      name: e.target.value,
                                    })
                                  }
                                />
                                <div className="mt-2 flex w-full justify-between gap-1">
                                  {colors.map((color, index) => (
                                    <div
                                      onClick={() => {
                                        setNewPlaylist({
                                          ...newPlaylist,
                                          color: color,
                                        });
                                      }}
                                      className={`w-8 h-8 border-2 rounded-full bg-${color}-50 border-${color}-200  hover:cursor-pointer click-action`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex p-4 gap-4 items-center">
                      <div className="flex-1 text-primary-600">
                        Manage playlists
                      </div>
                      <button className="px-4 py-2 border-[1px] rounded-lg">
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          applyPlaylistChange();
                        }}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg flex min-w-fit"
                      >
                        {applying && <Spinner small />}Apply
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default SlidePlaylist;
