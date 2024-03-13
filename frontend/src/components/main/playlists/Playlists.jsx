import React, { useEffect, useState } from "react";
import Playlist from "./Playlist";
import useAuthHttpClient from "../../../hooks/useAuthHttpClient";
import { useAuth } from "../../../providers/authProvider";
import { useQuiz } from "../../../hooks/useQuiz";
import { Spinner } from "../../icons/Spinner";

function Playlists() {
  const authHttpClient = useAuthHttpClient();
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await authHttpClient.post("/playlist/filter", {
          user_id: user._id,
        });
        setPlaylists(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPlaylists();
  }, [user]);

  return (
    <>
      {isLoading ? (
        <div
          role="status"
          className="h-[70vh] pb-20 flex justify-center items-center"
        >
          <Spinner />
        </div>
      ) : (<div className="inline-block min-w-full py-2 align-middle">
        <div className="flex flex-col gap-4">
          {playlists.map((playlist, idx) => (
            <Playlist key={idx} playlist={playlist} />
          ))}
        </div>
      </div>)}
    </>
  );
}

export default Playlists;
