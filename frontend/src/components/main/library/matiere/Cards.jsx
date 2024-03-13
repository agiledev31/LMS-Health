
import Filter from "../../Filter";
import { useEffect, useState } from "react";
import useAuthHttpClient from "../../../../hooks/useAuthHttpClient";
import SearchField from "../../SearchField";

export default function Cards(matiere_id) {
  const authHttpClient = useAuthHttpClient();
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("here");
    const fetchCards = async () => {
      try {
        const response = await authHttpClient.post(`/card/filter`,{
          matiere_id
        });
        setCards(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCards();
  }, []);
  return (
    <>
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        <div className="inline-block min-w-full align-middle">
        <div className="p-4 flex justify-between">
        <SearchField />
        <Filter />
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
                    // onClick={() => {
                    //   setSelectedCard(card);
                    //   setOpenEditCardSlide(true);
                    // }}
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
    </>
  );
}
