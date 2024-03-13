import axios from "axios";
import { useEffect, useState } from "react";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useAuth } from "../../providers/authProvider";

export const ItemProgressBar = ({ item }) => {
  const authHttpClient = useAuthHttpClient();
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const fetchItemProgress = async () => {
      authHttpClient
        .post("/progress/item/filter", { item_id: item._id, user_id: user._id })
        .then((response) => {
          setProgress(
            Math.round(
              (response.data.data[0].progress_rate / item.n_questions) * 100
            )
          );
        })
        .catch(() => {
          setProgress(0);
        });
    };
    fetchItemProgress();
  }, [item, user]);
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 rounded-full min-w-[200px] bg-gray-300">
        <div
          style={{ width: `${progress}%` }}
          className="h-full rounded-full bg-primary-600"
        ></div>
      </div>
      <div>{progress}%</div>
    </div>
  );
};
