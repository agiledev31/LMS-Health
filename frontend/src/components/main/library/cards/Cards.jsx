import {  useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import AddNewCardSlide from "./AddNewCardSlide";
import EditCardSlide from "./EditCardSlide";
import Search from "../../Search";
import { useData } from "../../../../providers/learningDataProvider";
import SearchField from "../../SearchField";

export default function Cards() {
  const { cards: allCards, setCards } = useData();
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const cards =
    searchText === ""
      ? allCards
      : allCards.filter(({ name }) =>
          name.toLowerCase().includes(searchText.toLowerCase())
        );
  const [openNewCardSlide, setOpenNewCardSlide] = useState(false);
  const [openEditCardSlide, setOpenEditCardSlide] = useState(false);

  return (
    <>
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        <div className="inline-block min-w-full align-middle">
          <div className="flex justify-between">
            <button
              onClick={() => {
                setOpenNewCardSlide(true);
              }}
              className="click-action inline-flex justify-between border-2 border-gray-300 items-center gap-x-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold hover:text-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 hover:outline-primary-600"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Add New Card
            </button>
            <div className="flex items-center space-x-2">
              <SearchField searchText={searchText} setSearchText={setSearchText} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cards.map((card) => (
              <div className="group border-2 rounded-lg min-h-[200px] bg-white p-6 hover:shadow-lg hover:shadow-gray-300 click-action">
                <div className="group-hover:hidden flex flex-col h-full">
                  <div className="py-2 text-2xl font-extrabold">
                    {card.name}
                  </div>
                  <div className="flex-1 flex-wrap ">{card.def}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {card.items.map((item) => (
                      <div className="px-2 border border-gray-400 rounded-md text-[12px]">
                        {item.item_number}. {item.name}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hidden group-hover:flex items-center justify-center h-full">
                  <div
                    onClick={() => {
                      setSelectedCard(card);
                      setOpenEditCardSlide(true);
                    }}
                    className="px-4 py-2 text-gray-500 font-bold border-2 border-gray-200 rounded-md  hover:cursor-pointer hover:shadow-md"
                  >
                    open
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AddNewCardSlide
        open={openNewCardSlide}
        setOpen={setOpenNewCardSlide}
        setCards={setCards}
      />
      <EditCardSlide
        open={openEditCardSlide}
        setOpen={setOpenEditCardSlide}
        setCards={setCards}
        selectedCard={selectedCard}
      />
      {/* <AddNewCardSlide open={openNewCardSlide} setOpen={setOpenNewCardSlide} /> */}
    </>
  );
}
