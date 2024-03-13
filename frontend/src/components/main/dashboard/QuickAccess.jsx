import React, { useEffect, useState } from "react";
import useAuthHttpClient from "../../../hooks/useAuthHttpClient";
import ProgressCircle from "../../common/ProgressCircle";
import { ItemProgressBar } from "../../common/ItemProgressBar";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function QuickAccess({ clickAction, item, setQuickAccessItems }) {
  const navigator = useNavigate();
  const authHttpClient = useAuthHttpClient();
  const remove = async () => {
    try {
      const response = await authHttpClient.delete(`/quickaccess/${item._id}`);
      setQuickAccessItems((_) => _.filter((_item) => _item._id !== item._id));
    } catch (error) {
      console.log(error);
    }
  };
  const QuickAccessMatiere = ({ id, matiere_id }) => {
    const [matiere, setMatiere] = useState();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const fetchMatiere = async () => {
        try {
          const response = await authHttpClient.get(`/matiere/${matiere_id}`);
          setMatiere(response.data.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchMatiere();
    }, [matiere_id, id]);
    return (
      <div
        onClick={() => {
          navigator(`/library/matiere/${matiere_id}`);
        }}
        className="group relative bg-gray-100 p-2 border-2 rounded-lg flex items-center hover:cursor-pointer group click-action hover:shadow-lg hover:shadow-primary-300"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            remove();
          }}
          className="hidden group-hover:block rounded-full bg-gray-100 border-2 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 hover:text-red-600"
        >
          <XMarkIcon className="w-4 h-4" />
        </div>
        <div className="px-2 flex-1 text-center truncate max-w-full items-center flex gap-2">
          
        <img
            src={matiere?.image}
            alt={matiere?.name}
            className="h-8 w-8 flex-shrink-0 rounded-full"
          />
          <p className="flex-1 truncate">{matiere?.name}</p>
        </div>
        {matiere && <ProgressCircle r={30} matiere={matiere} />}
      </div>
    );
  };

  const QuickAccessItem = ({ id, item_id }) => {
    const [item, setItem] = useState();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const fetchItem = async () => {
        try {
          const response = await authHttpClient.get(`/item/${item_id}`);
          setItem(response.data.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchItem();
    }, [item_id, id]);
    return (
      <div
        onClick={() => {
          navigator(`/library/item/${item_id}`);
        }}
        className="relative group bg-gray-100 py-4 px-2 border-2 rounded-lg flex flex-col items-center hover:cursor-pointer group click-action hover:shadow-lg hover:shadow-primary-300"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            remove();
          }}
          className="hidden group-hover:block rounded-full bg-gray-100 border-2 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 hover:text-red-600"
        >
          <XMarkIcon className="w-4 h-4" />
        </div>
        <div className="px-2 text-center  flex-auto truncate  max-w-full">
          {item && `${item.item_number}. ${item.name}`}
        </div>
        {item && <ItemProgressBar item={item} />}
      </div>
    );
  };
  return item ? (
    item.MatiereOrItem === "Matiere" ? (
      <QuickAccessMatiere id={item._id} matiere_id={item.matiere_or_item_id} />
    ) : (
      <QuickAccessItem id={item._id} item_id={item.matiere_or_item_id} />
    )
  ) : (
    <div
      onClick={clickAction}
      className="p-2 border-2 border-dashed rounded-lg flex flex-col justify-center items-center hover:cursor-pointer group click-action hover:shadow-lg hover:shadow-primary-300"
    >
      <div className="w-9 h-9 m-1 rounded-full border-4 border-gray-50 bg-gray-100 text-xs flex justify-center items-center group-hover:border-primary-200 group-hover:bg-primary-600 group-hover:text-white">
        +
      </div>
      <div className="text-center text-xs group-hover:text-primary-600">
        Ajoute une matière ou un item
      </div>
    </div>
  );
}

export default QuickAccess;
