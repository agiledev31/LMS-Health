import { ClockIcon } from "@heroicons/react/20/solid";
import { format, isSameDay, parse } from "date-fns";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const getEvents = (events, date) => {
  return events.filter((event) =>
    isSameDay(parse(event.date, "yyyy-MM-dd", new Date()), date)
  );
};

export default function MonthView({
  days,
  events,
  selectedDay,
  setSelectedDay,
  clickEventHandle,
}) {
  return (
    <>
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-white py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-white py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
        </div>
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day, idx) => (
              <button
                onClick={() => {
                  setSelectedDay(day.date);
                }}
                key={idx}
                className={classNames(
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-500",
                  "relative px-3 py-2 hover:cursor-pointer"
                )}
              >
                <time
                  dateTime={day.date}
                  className={
                    day.isToday
                      ? "flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 font-semibold text-white"
                      : undefined
                  }
                >
                  {format(day.date, "dd")}
                </time>
                {getEvents(events, day.date).length > 0 && (
                  <ol className="mt-2">
                    {getEvents(events, day.date)
                      .slice(0, 2)
                      .map((event, idx) => (
                        <li key={idx} onClick={()=>{clickEventHandle()}}>
                          <a href={event.href} className="group flex">
                            <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-primary-600">
                              {event.title}
                            </p>
                            <time
                              dateTime={event.datetime}
                              className="ml-3 hidden flex-none text-gray-500 group-hover:text-primary-600 xl:block"
                            >
                              {event.from}
                            </time>
                          </a>
                        </li>
                      ))}
                    {getEvents(events, day.date).length > 2 && (
                      <li className="text-gray-500">
                        + {getEvents(events, day.date).length - 2} more
                      </li>
                    )}
                  </ol>
                )}
              </button>
            ))}
          </div>
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {days.map((day) => (
              <button
                onClick={() => {
                  setSelectedDay(day.date);
                }}
                key={day.date}
                type="button"
                className={classNames(
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                  (day.isSelected || day.isToday) && "font-semibold",
                  day.isSelected && "text-white",
                  !day.isSelected && day.isToday && "text-primary-600",
                  !day.isSelected &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    "text-gray-900",
                  !day.isSelected &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    "text-gray-500",
                  "flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10"
                )}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    day.isSelected &&
                      "flex h-6 w-6 items-center justify-center rounded-full",
                    day.isSelected && day.isToday && "bg-primary-600",
                    day.isSelected && !day.isToday && "bg-gray-900",
                    "ml-auto"
                  )}
                >
                  {format(day.date, "dd")}
                </time>
                <span className="sr-only">
                  {getEvents(events, day.date).length} events
                </span>
                {getEvents(events, day.date).length > 0 && (
                  <span className="-mx-0.5 mt-auto flex flex-wrap-reverse">
                    {getEvents(events, day.date).map((event, id) => (
                      <span
                        key={id}
                        className="mx-0.5 mb-1 h-1.5 w-1.5 rounded-full bg-gray-400"
                      />
                    ))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {getEvents(events, selectedDay).length > 0 && (
        <div className="px-4 py-10 sm:px-6 lg:hidden">
          <ol className="divide-y divide-gray-100 overflow-hidden rounded-lg bg-white text-sm shadow ring-1 ring-black ring-opacity-5">
            {getEvents(events, selectedDay).map((event, id) => (
              <li
                key={id}
                onClick={()=>{clickEventHandle()}}
                className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50"
              >
                <div className="flex-auto">
                  <p className="font-semibold text-gray-900">{event.title}</p>
                  <time
                    dateTime={event.datetime}
                    className="mt-2 flex items-center text-gray-700"
                  >
                    <ClockIcon
                      className="mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    {event.from}
                  </time>
                </div>
                <a
                  href={event.href}
                  className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100"
                >
                  Edit<span className="sr-only">, {event.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      )}
    </>
  );
}
