import React, { useEffect, useMemo, useState } from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isSameWeek,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";

import Header from "../../components/main/planner/header";
import DayView from "../../components/main/planner/dayView";
import WeekView from "../../components/main/planner/weekView";
import MonthView from "../../components/main/planner/monthView";
import AddEventModal from "../../components/main/planner/addEventModal";
import { useAuth } from "../../providers/authProvider";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { useData } from "../../providers/learningDataProvider";
import ConfirmModal from "../../components/common/ConfirmModal";
import { useNavigate } from "react-router-dom";

function PlannerPage() {
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

  const [view, setView] = useState("Day view");
  const [today, setToday] = useState(startOfToday());
  const [selectedDay, setSelectedDay] = useState(today);
  const [firstDayCurrentMonth, setFirstDayCurrentMonth] = useState(
    parse(format(today, "MMM-yyyy"), "MMM-yyyy", new Date())
  );
  const [days, setDays] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(
    eachDayOfInterval({
      start: startOfWeek(selectedDay),
      end: endOfWeek(selectedDay),
    })
  );

  const dailyEvents = useMemo(
    () =>
      events.filter((event) =>
        isSameDay(parse(event.date, "yyyy-MM-dd", new Date()), selectedDay)
      ),
    [selectedDay, events]
  );
  const weeklyEvents = useMemo(
    () =>
      events.filter((event) =>
        isSameWeek(parse(event.date, "yyyy-MM-dd", new Date()), selectedDay)
      ),
    [selectedDay, events]
  );
  const monthlyEvents = useMemo(
    () =>
      events.filter((event) =>
        isSameMonth(
          parse(event.date, "yyyy-MM-dd", new Date()),
          firstDayCurrentMonth
        )
      ),
    [firstDayCurrentMonth, events]
  );

  const [open, setOpen] = useState(false);
  const addEvent = () => {
    setOpen(true);
  };

  const goToToday = () => {
    setSelectedDay(today);
  };

  const next = () => {
    switch (view) {
      case "Day view":
        nextDay();
        break;
      case "Week view":
        nextWeek();
        break;
      case "Month view":
        nextMonth();
        break;
      default:
        break;
    }
  };
  const previous = () => {
    switch (view) {
      case "Day view":
        previousDay();
        break;
      case "Week view":
        previousWeek();
        break;
      case "Month view":
        previousMonth();
        break;
      default:
        break;
    }
  };
  const previousDay = () => {
    setSelectedDay(add(selectedDay, { days: -1 }));
  };
  const nextDay = () => {
    setSelectedDay(add(selectedDay, { days: +1 }));
  };
  const previousWeek = () => {
    setSelectedDay(add(selectedDay, { days: -7 }));
  };
  const nextWeek = () => {
    setSelectedDay(add(selectedDay, { days: +7 }));
  };
  const previousMonth = () => {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setFirstDayCurrentMonth(firstDayPreviousMonth);
  };
  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setFirstDayCurrentMonth(firstDayNextMonth);
  };

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
  }, [today, firstDayCurrentMonth, selectedDay]);

  useEffect(() => {
    setInterval(() => {
      setToday(startOfToday());
    }, 60000);
  });

  useEffect(() => {
    setFirstDayCurrentMonth(
      parse(format(selectedDay, "MMM-yyyy"), "MMM-yyyy", new Date())
    );
  }, [selectedDay]);

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

  return (
    <div className="-mx-4 -mt-24 -mb-10 pt-16 sm:-mx-6 px-2 sm:px-6 pb-8 lg:-mt-10 lg:px-8 lg:-mx-8 lg:pt-4 h-screen bg-gray-50 ">
      <div className="flex h-full flex-col">
        <Header
          title={format(firstDayCurrentMonth, "MMMM yyyy")}
          view={view}
          setView={setView}
          addEvent={addEvent}
          control={{ goToToday, previous, next }}
        />
        {view === "Day view" && (
          <DayView
            firstDayCurrentMonth={firstDayCurrentMonth}
            days={days}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            events={dailyEvents}
            previousMonth={previousMonth}
            nextMonth={nextMonth}
            selectedWeek={selectedWeek}
            today={today}
            clickEventHandle={clickEventHandle}
          />
        )}
        {view === "Week view" && (
          <WeekView
            selectedWeek={selectedWeek}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            today={today}
            events={weeklyEvents}
            clickEventHandle={clickEventHandle}
          />
        )}
        {view === "Month view" && (
          <MonthView
            days={days}
            events={monthlyEvents}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            clickEventHandle={clickEventHandle}
          />
        )}
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

export default PlannerPage;
