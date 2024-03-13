import React, { useEffect } from "react";
import Search from "../../components/main/Search";
import Filter from "../../components/main/Filter";
import Breadcrumb from "../../components/main/Breadcrumb";
import SearchField from "../../components/main/SearchField";

function Toolbox() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const pages = [{ name: "Toolbox", current: true }];

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
    {
      title: "Score de Wells",
      desc: "Causes d’angor fonctionnel.",
      categories: [
        { id: 230, title: "Douleur thoracique aiguë" },
        { id: 339, title: "SCA" },
      ],
    },
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
    {
      title: "Score de Wells",
      desc: "Causes d’angor fonctionnel.",
      categories: [
        { id: 230, title: "Douleur thoracique aiguë" },
        { id: 339, title: "SCA" },
      ],
    },
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
    {
      title: "Score de Wells",
      desc: "Causes d’angor fonctionnel.",
      categories: [
        { id: 230, title: "Douleur thoracique aiguë" },
        { id: 339, title: "SCA" },
      ],
    },
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
    <div>
      <div className="-mt-4 mb-6">
        <Breadcrumb pages={pages} />
      </div>
      <div className="flex justify-between">
        <div className="text-3xl font-bold">Toolbox</div>
      </div>
      <div className="mt-4 -mx-4 sm:-mx-6 lg:-mx-8 -mb-8 px-4 sm:px-6 lg:px-8 p-4 bg-gray-50  border-t-2 border-gray-200">
        <div className="p-4 flex flex-row-reverse gap-4">
          <div className="bg-white">
            <Filter />
          </div>
          <SearchField />
        </div>
        <div>
          <div
            className="isolate inline-flex -space-x-px rounded-md py-4 flex-wrap"
            aria-label="Pagination"
          >
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 rounded-l-md">
              A
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              B
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              C
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              D
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              E
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              F
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              G
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              H
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              I
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              J
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              K
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              L
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              M
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              N
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              O
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              P
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              Q
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              R
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              S
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              T
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              U
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              V
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              W
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              X
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
              Y
            </div>
            <div className="bg-white hover:cursor-pointer relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 rounded-r-md">
              Z
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* {cards.map((card) => (
            <div className="border-2 rounded-lg min-h-[200px] bg-white p-6 hover:shadow-lg hover:shadow-gray-300 click-action">
              <div className="flex flex-col h-full">
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
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}

export default Toolbox;
