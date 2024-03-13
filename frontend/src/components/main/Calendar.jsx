import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import AddEventModal from "./planner/addEventModal";
import { useData } from "../../providers/learningDataProvider";
import { useAuth } from "../../providers/authProvider";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../common/ConfirmModal";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Calendar() {
  const container = useRef(null);
  const containerNav = useRef(null);
  const containerOffset = useRef(null);

  const { user } = useAuth();
  const authHttpClient = useAuthHttpClient();
  const { loading, matieres, items } = useData();
  const [events, setEvents] = useState([]);
  const [rawEventData, setRawEventData] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await authHttpClient.post("/schedule/filter/", {
        user_id: user._id,
      });
      setRawEventData(response.data.data);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    !loading && rawEventData.length && setEvents(rawEventData.map(parseEvent));
  }, [loading, rawEventData, matieres, items]);

  const parseEvent = (event) => ({
    id: event.matiere_or_item_id,
    type: event.MatiereOrItem,
    title:
      event.MatiereOrItem === "Matiere"
        ? matieres.find(({ _id }) => _id === event.matiere_or_item_id)?.name
        : items.find(({ _id }) => _id === event.matiere_or_item_id)?.name,
    date: format(new Date(event.from), "yyyy-MM-dd"),
    from: format(new Date(event.from), "HH:mm"),
    to: format(new Date(event.to), "HH:mm"),
    desc: event.desc,
  });

  // click handler
  const navigator = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState();
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const clickEventHandle = (event) => {
    setSelectedEvent(event);
    setOpenConfirmModal(true);
  };
  const goToLibrary = () => {
    navigator(
      `/library/${selectedEvent.type.toLowerCase()}/${selectedEvent.id}`
    );
  };

  const today = useMemo(() => startOfToday(), []);
  const [selectedDay, setSelectedDay] = useState(today);
  const [selectedWeek, setSelectedWeek] = useState(
    eachDayOfInterval({
      start: startOfWeek(selectedDay),
      end: endOfWeek(selectedDay),
    })
  );
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [firstDayCurrentMonth, setFirstDayCurrentMonth] = useState(
    parse(currentMonth, "MMM-yyyy", new Date())
  );
  const [days, setDays] = useState([]);

  useEffect(() => {
    setSelectedWeek(
      eachDayOfInterval({
        start: startOfWeek(selectedDay),
        end: endOfWeek(selectedDay),
      })
    );
  }, [selectedDay]);

  useEffect(() => {
    const _days_ = eachDayOfInterval({
      start: firstDayCurrentMonth,
      end: endOfMonth(firstDayCurrentMonth),
    }).map((date) => ({
      date: date,
      isCurrentMonth: true,
      isToday: isEqual(today, date),
      isSelected: isEqual(selectedDay, date),
    }));
    for (let i = 1; i < getDay(firstDayCurrentMonth) + 1; i++)
      _days_.unshift({
        date: add(firstDayCurrentMonth, { days: -i }),
        isCurrentMonth: false,
      });
    for (let i = 1; i < 7 - getDay(endOfMonth(firstDayCurrentMonth)); i++)
      _days_.push({
        date: add(endOfMonth(firstDayCurrentMonth), { days: i }),
        isCurrentMonth: false,
      });
    setDays(() => _days_);
    // console.log(today, firstDayCurrentMonth, selectedDay);
  }, [today, firstDayCurrentMonth, selectedDay]);

  const toPreviousMonth = () => {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"));
    setFirstDayCurrentMonth(firstDayPreviousMonth);
  };

  const toNextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    setFirstDayCurrentMonth(firstDayNextMonth);
  };

  useEffect(() => {
    // Set the container scroll position based on the current time.
    const currentMinute = new Date().getHours() * 60;
    container.current.scrollTop =
      ((container.current.scrollHeight -
        containerNav.current.offsetHeight -
        containerOffset.current.offsetHeight) *
        currentMinute) /
      1440;
  }, []);

  //New event modal
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <header className="flex flex-none items-center justify-between border-b border-gray-200 px-6 py-4">
        <div>
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            <time dateTime="2022-01-22" className="sm:hidden">
              {format(selectedDay, "MMM dd, yyyy")}
            </time>
            <time dateTime="2022-01-22" className="hidden sm:inline">
              {format(selectedDay, "MMMM dd, yyyy")}
            </time>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {format(selectedDay, "EEEE")}
          </p>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => {
              setOpen(true);
            }}
            type="button"
            className="ml-6 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            Add event
          </button>
        </div>
      </header>
      <div className="isolate flex flex-auto overflow-hidden bg-white">
        <div ref={container} className="flex flex-auto flex-col overflow-auto">
          <div
            ref={containerNav}
            className="sticky top-0 z-10 grid flex-none grid-cols-7 bg-white text-xs text-gray-500 shadow ring-1 ring-black ring-opacity-5 md:hidden"
          >
            {selectedWeek.map((date) => (
              <button
                type="button"
                key={date}
                onClick={() => {
                  setSelectedDay(date);
                }}
                className="flex flex-col items-center pb-1.5 pt-3"
              >
                <span>{format(date, "EEEEE")}</span>
                {/* Default: "text-gray-900", Selected: "bg-gray-900 text-white", Today (Not Selected): "text-primary-600", Today (Selected): "bg-primary-600 text-white" */}
                <span
                  className={classNames(
                    "mt-3 flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-gray-900",
                    isSameDay(date, today) && "text-primary-600",
                    isSameDay(date, selectedDay) &&
                      "rounded-full bg-gray-900 text-white"
                  )}
                >
                  {format(date, "dd")}
                </span>
              </button>
            ))}
          </div>
          <div className="flex w-full flex-auto">
            <div className="w-14 flex-none bg-white ring-1 ring-gray-100" />
            <div className="grid flex-auto grid-cols-1 grid-rows-1">
              {/* Horizontal lines */}
              <div
                className="col-start-1 col-end-2 row-start-1 grid divide-y divide-gray-100"
                style={{ gridTemplateRows: "repeat(48, minmax(3.5rem, 1fr))" }}
              >
                <div ref={containerOffset} className="row-end-1 h-7"></div>
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    12AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    1AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    2AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    3AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    4AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    5AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    6AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    7AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    8AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    9AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    10AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    11AM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    12PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    1PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    2PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    3PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    4PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    5PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    6PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    7PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    8PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    9PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    10PM
                  </div>
                </div>
                <div />
                <div>
                  <div className="sticky left-0 -ml-14 -mt-2.5 w-14 pr-2 text-right text-xs leading-5 text-gray-400">
                    11PM
                  </div>
                </div>
                <div />
              </div>

              {/* Events */}
              <ol
                className="col-start-1 col-end-2 row-start-1 grid grid-cols-1"
                style={{
                  gridTemplateRows: "1.75rem repeat(288, minmax(0, 1fr)) auto",
                }}
              >
                {events?.map((event, idx) => (
                  <li
                    key={idx}
                    className="relative mt-px flex"
                    style={{
                      gridRow: `${
                        Number(
                          format(parse(event.from, "HH:mm", new Date()), "HH")
                        ) *
                          12 +
                        2
                      } / span ${
                        (Number(
                          format(parse(event.to, "HH:mm", new Date()), "HH")
                        ) -
                          Number(
                            format(parse(event.from, "HH:mm", new Date()), "HH")
                          )) *
                        12
                      }`,
                    }}
                    onClick={() => clickEventHandle(event)}
                  >
                    <div className="group absolute inset-1 flex flex-col overflow-y-auto rounded-lg bg-blue-50 p-2 text-xs leading-5 hover:bg-blue-100">
                      <p className="order-1 font-semibold text-blue-700">
                        {event.title}
                      </p>
                      <p className="text-blue-500 group-hover:text-blue-700">
                        <time dateTime="2022-01-22T06:00">
                          {format(
                            parse(event.from, "HH:mm", new Date()),
                            "hh:mm a"
                          )}
                        </time>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <div className=" w-1/2 max-w-md flex-none border-l border-gray-100 px-8 py-10">
          <div className="flex items-center text-center text-gray-900">
            <button
              onClick={toPreviousMonth}
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex-auto text-sm font-semibold">
              {format(firstDayCurrentMonth, "MMMM yyyy")}
            </div>
            <button
              onClick={toNextMonth}
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            {days.map((day, dayIdx) => (
              <button
                onClick={() => setSelectedDay(day.date)}
                key={day.date}
                type="button"
                className={classNames(
                  "py-1.5 hover:bg-gray-100 focus:z-10",
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                  (day.isSelected || day.isToday) && "font-semibold",
                  day.isSelected && "text-white",
                  !day.isSelected &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    "text-gray-900",
                  !day.isSelected &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    "text-gray-400",
                  day.isToday && !day.isSelected && "text-primary-600",
                  dayIdx === 0 && "rounded-tl-lg",
                  dayIdx === 6 && "rounded-tr-lg",
                  dayIdx === days.length - 7 && "rounded-bl-lg",
                  dayIdx === days.length - 1 && "rounded-br-lg"
                )}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                    day.isSelected && day.isToday && "bg-primary-600",
                    day.isSelected && !day.isToday && "bg-gray-900"
                  )}
                >
                  {format(day.date, "dd")}
                </time>
              </button>
            ))}
          </div>
        </div>
      </div>
      <AddEventModal
        open={open}
        setOpen={setOpen}
        events={events}
        setEvents={setEvents}
      />
      <ConfirmModal
        open={openConfirmModal}
        setOpen={setOpenConfirmModal}
        content={`Do you want to study this Matiere/Item?`}
        withOutCancel
        onConfirm={() => {
          goToLibrary();
        }}
      />
    </div>
  );
}
