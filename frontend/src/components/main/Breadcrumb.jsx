import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function Breadcrumb({ pages }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <li>
          <div>
            <Link to={"/"} className="text-gray-400 hover:text-primary-600">
              <HomeIcon className="h-5 w-5 flex-shrink-0 stroke-2" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {pages.map((page, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <Link
                to={page.href}
                className={`${
                  page.current ? "text-primary-600" : "text-gray-500"
                } ml-4 font-bold  hover:font-extrabold hover:text-primary-600 max-w-sm truncate `}
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
