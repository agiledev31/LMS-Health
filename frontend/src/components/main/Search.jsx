import React, { useState } from "react";
import SearchIcon from "../icons/SearchIcon";
import { useData } from "../../providers/learningDataProvider";
import { Combobox } from "@headlessui/react";
import ComboBoxTestModal from "../../pages/main/ComboBoxTestModal";
import SearchField from "./SearchField";
import { useNavigate } from "react-router-dom";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function Search({ openSearch }) {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const { matieres, items } = useData();

  const [selectedMatieres, setSelectedMatieres] = useState([]);

  const filteredMatieres =
    searchText === ""
      ? matieres
      : matieres.filter((matiere) => {
          return matiere.name.toLowerCase().includes(searchText.toLowerCase());
        });
  const filteredItems =
    searchText === ""
      ? items
      : items.filter((item) => {
          return (
            filteredMatieres.map((x) => x._id).includes(item.matiere_id) ||
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.item_number.toString().includes(searchText)
          );
        });

  return (
    <div className="flex justify-center">
      <div className="max-w-[450px]">
        <SearchField
          searchText={searchText}
          setSearchText={setSearchText}
          extraClassInput={"rounded-t-lg"}
        />

        {filteredMatieres.length > 0 && (
          <div
            id="search-results"
            className={
              "block pt-3 h-full w-full  text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm border-2 border-t-0 border-gray-400 focus:border-primary-600 bg-white text-left max-w-[450px]" +
              (filteredItems.length == 0 ? " rounded-b-lg" : "")
            }
          >
            <p className="pl-3">Results of your search</p>

            {filteredMatieres.map((matiere) => (
              <div
                className="flex w-full pl-3 pb-2 pt-2  hover:cursor-pointer hover:bg-gray-300 max-w-[450px]"
                key={matiere.id}
                onClick={(e) => {
                  navigate("/library/matiere/" + matiere._id);
                  openSearch(false);
                }}
              >
                <div className="h-[20px] w-[40px] items-center">
                  {matiere.image && (
                    <img
                      className="h-[20px] w-[40px] bg-gray-100 rounded-lg flex flex-col"
                      src={matiere.image}
                    />
                  )}
                </div>
                <div className="h-full flex items-center">
                  <p className="ml-4 mr-4">{matiere.name}</p>
                  <p className="text-xs text-gray items-center">
                    Matiere - {matiere.n_questions} questions
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {filteredItems.length > 0 && (
          <div
            id="search-results"
            className="block pt-3 h-full w-full  text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm  rounded-b-lg border-2 border-t-0 border-gray-400 focus:border-primary-600 bg-white text-left max-w-[750px]"
          >
            <p className="pl-3">Items</p>

            {filteredItems.map((item) => (
              <div
                className="flex w-full pl-3 pb-2 pt-2  hover:cursor-pointer hover:bg-gray-300"
                key={item.id}
                onClick={(e) => {
                  navigate("/library/item/" + item._id);
                  openSearch(false);
                }}
              >
                {/* <img className = "max-h-[40px] max-w-[40px] bg-gray-100 rounded-lg flex flex-col" src = {item.image}/> */}
                <div className="h-full flex items-center pl-4">
                  <p className="ml-4 mr-4">
                    {item.item_number}. {item.name}
                  </p>
                  <p className="text-xs text-gray items-center">
                    {item.n_questions} questions
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
