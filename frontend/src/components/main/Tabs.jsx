function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Tabs({ tabs, setCurrentTab }) {
  return (
        <div className="-mx-4 sm:-mx-6 lg:-mx-8 border-b-2 border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 -mb-px flex space-x-8 hover:cursor-pointer" aria-label="Tabs">
            {tabs.map((tab) => (
              <div
                key={tab.name}
                onClick={()=>{setCurrentTab(tab.name);}}
                className={classNames(
                  tab.current
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium click-action"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                <tab.icon
                  className={classNames(
                    tab.current
                      ? "text-primary-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "-ml-0.5 mr-2 h-5 w-5 stroke-2"
                  )}
                  aria-hidden="true"
                />
                <span className="font-bold">{tab.name}</span>
              </div>
            ))}
          </div>
    </div>
  );
}
