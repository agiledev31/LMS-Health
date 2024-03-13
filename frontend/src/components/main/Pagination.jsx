import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

export default function Pagination({
  totalNumber,
  pageNumber,
  pageSize,
  setPageNumber,
  setPageSize,
}) {
  const lastPageNumber = Math.ceil(totalNumber / pageSize);
  const [paginationItems, setPaginationItems] = useState([]);

  useEffect(() => {
    const tempPaginationItems = [];
    if (lastPageNumber < 8) {
      for (let i = 0; i < lastPageNumber; i++) {
        tempPaginationItems[i] = i + 1;
      }
    } else {
      tempPaginationItems[0] = 1;
      tempPaginationItems[1] =
        pageNumber < 5 || pageNumber > lastPageNumber - 3 ? 2 : 0;
      tempPaginationItems[2] =
        pageNumber < 5 || pageNumber > lastPageNumber - 2
          ? 3
          : pageNumber === lastPageNumber - 2
          ? 0
          : pageNumber - 1;
      tempPaginationItems[3] =
        pageNumber < 3 || pageNumber > lastPageNumber - 2
          ? 0
          : pageNumber < 5
          ? 4
          : pageNumber > lastPageNumber - 4
          ? lastPageNumber - 3
          : pageNumber;
      tempPaginationItems[4] =
        pageNumber < 3 || pageNumber > lastPageNumber - 4
          ? lastPageNumber - 2
          : pageNumber === 3
          ? 0
          : pageNumber + 1;
      tempPaginationItems[5] =
        pageNumber < 3 || pageNumber > lastPageNumber - 4
          ? lastPageNumber - 1
          : 0;
      tempPaginationItems[6] = lastPageNumber;
    }
    setPaginationItems(tempPaginationItems);
  }, [lastPageNumber, pageNumber]);

  const PaginationItem = ({ number }) => {
    return (
      <div
        onClick={() => {
          setPageNumber(number);
        }}
        className={`hover:cursor-pointer inline-flex items-center px-4 py-2 text-sm font-semibold ${
          pageNumber === number
            ? "z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
        }`}
      >
        {number}
      </div>
    );
  };

  const Ellipsis = () => (
    <div className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
      ...
    </div>
  );

  const previousPage = () => {
    pageNumber > 1 && setPageNumber(pageNumber - 1);
  };
  const nextPage = () => {
    pageNumber < lastPageNumber && setPageNumber(pageNumber + 1);
  };
  return (
    <div className="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6  sm:rounded-b-lg">
      <div className="flex flex-1 justify-between sm:hidden">
        <div
          onClick={() => {
            previousPage();
          }}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </div>
        <div
          onClick={() => {
            nextPage();
          }}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </div>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            {`Showing ${
              lastPageNumber > 0 ? (pageNumber - 1) * pageSize + 1 : 0
            } to ${Math.min(
              pageNumber * pageSize,
              totalNumber
            )} of ${totalNumber} results`}
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              onClick={() => {
                previousPage();
              }}
              className="hover:cursor-pointer relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            {paginationItems.map((item, index) =>
              item === 0 ? (
                <Ellipsis key={index} />
              ) : (
                <PaginationItem key={index} number={item} />
              )
            )}
            <div
              onClick={() => {
                nextPage();
              }}
              className="hover:cursor-pointer relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
