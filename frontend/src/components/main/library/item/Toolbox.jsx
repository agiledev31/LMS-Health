import React from "react";
import Search from "../../Search";
import SearchField from "../../SearchField";

function Toolbox() {
  const cards = [
    {
      title: "Score de Genève",
      desc: "Description d’une des causes majeures de douleur thoracique aiguë.",
      categories: [
        { id: 230, title: "Douleur thoracique aiguë" },
        { id: 150, title: "Pneumothorax" },
      ],
    },
    {
      title: "Score de Wells",
      desc: "Causes d’angor fonctionnel.",
      categories: [
        { id: 230, title: "Douleur thoracique aiguë" },
        { id: 339, title: "SCA" },
      ],
    },
  ];
  return (
    <>
      <div className="p-4">
        <SearchField />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className="border-2 rounded-lg min-h-[200px] bg-white p-6 hover:shadow-lg hover:shadow-gray-300 click-action hover:cursor-pointer flex flex-col"
          >
            <div className="py-2 text-2xl font-extrabold">{card.title}</div>
            <div className="flex-1">{card.desc}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {card.categories.map((category) => (
                <div className="px-2 border border-gray-400 rounded-md text-[12px]">
                  {category.id}. {category.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Toolbox;
