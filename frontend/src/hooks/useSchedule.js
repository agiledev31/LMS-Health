import React, { useEffect, useMemo, useState } from "react";

import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  getWeek,
  isEqual,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isToday,
  parse,
  parseISO,
  startOfToday,
  startOfWeek,
} from "date-fns";
const events = [
  {
    type: "matiere",
    id: 12,
    title: "Cardiologie",
    date: "2023-08-01",
    from: "17:00",
    to: "18:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 14,
    title: "Pneumologie",
    date: "2023-08-01",
    from: "13:00",
    to: "16:00",
    desc: "",
  },
  {
    type: "item",
    id: 1,
    title: "188. Endocardite infectieuse",
    date: "2023-08-01",
    from: "9:00",
    to: "10:00",
    desc: "here some description you added",
  },
  {
    type: "item",
    id: 2,
    title: "152. Endocardite infectieuse",
    date: "2023-08-01",
    from: "10:00",
    to: "11:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 12,
    title: "Cardiologie",
    date: "2023-08-02",
    from: "14:00",
    to: "15:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 14,
    title: "Pneumologie",
    date: "2023-08-02",
    from: "9:00",
    to: "12:00",
    desc: "",
  },
  {
    type: "item",
    id: 1,
    title: "188. Endocardite infectieuse",
    date: "2023-08-02",
    from: "9:00",
    to: "12:13",
    desc: "here some description you added",
  },
  {
    type: "item",
    id: 2,
    title: "152. Endocardite infectieuse",
    date: "2023-08-03",
    from: "7:00",
    to: "8:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 12,
    title: "Cardiologie",
    date: "2023-08-03",
    from: "9:00",
    to: "10:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 14,
    title: "Pneumologie",
    date: "2023-08-03",
    from: "14:00",
    to: "16:00",
    desc: "",
  },
  {
    type: "item",
    id: 1,
    title: "188. Endocardite infectieuse",
    date: "2023-08-03",
    from: "16:00",
    to: "17:00",
    desc: "here some description you added",
  },
  {
    type: "item",
    id: 2,
    title: "152. Endocardite infectieuse",
    date: "2023-08-05",
    from: "10:00",
    to: "11:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 12,
    title: "Cardiologie",
    date: "2023-08-05",
    from: "19:00",
    to: "21:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 14,
    title: "Pneumologie",
    date: "2023-08-05",
    from: "6:00",
    to: "8:00",
    desc: "",
  },
  {
    type: "item",
    id: 1,
    title: "188. Endocardite infectieuse",
    date: "2023-08-05",
    from: "13:00",
    to: "14:00",
    desc: "here some description you added",
  },
  {
    type: "item",
    id: 2,
    title: "152. Endocardite infectieuse",
    date: "2023-08-05",
    from: "17:00",
    to: "18:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 12,
    title: "Cardiologie",
    date: "2023-07-25",
    from: "17:00",
    to: "18:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 14,
    title: "Pneumologie",
    date: "2023-07-25",
    from: "13:00",
    to: "16:00",
    desc: "",
  },
  {
    type: "item",
    id: 1,
    title: "188. Endocardite infectieuse",
    date: "2023-07-25",
    from: "9:00",
    to: "10:00",
    desc: "here some description you added",
  },
  {
    type: "item",
    id: 2,
    title: "152. Endocardite infectieuse",
    date: "2023-07-25",
    from: "10:00",
    to: "11:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 12,
    title: "Cardiologie",
    date: "2023-07-26",
    from: "14:00",
    to: "15:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 14,
    title: "Pneumologie",
    date: "2023-07-25",
    from: "9:00",
    to: "12:00",
    desc: "",
  },
  {
    type: "item",
    id: 1,
    title: "188. Endocardite infectieuse",
    date: "2023-07-25",
    from: "9:00",
    to: "12:13",
    desc: "here some description you added",
  },
  {
    type: "item",
    id: 2,
    title: "152. Endocardite infectieuse",
    date: "2023-07-27",
    from: "7:00",
    to: "8:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 12,
    title: "Cardiologie",
    date: "2023-07-27",
    from: "9:00",
    to: "10:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 14,
    title: "Pneumologie",
    date: "2023-07-27",
    from: "14:00",
    to: "16:00",
    desc: "",
  },
  {
    type: "item",
    id: 1,
    title: "188. Endocardite infectieuse",
    date: "2023-07-27",
    from: "16:00",
    to: "17:00",
    desc: "here some description you added",
  },
  {
    type: "item",
    id: 2,
    title: "152. Endocardite infectieuse",
    date: "2023-07-28",
    from: "10:00",
    to: "11:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 12,
    title: "Cardiologie",
    date: "2023-07-28",
    from: "19:00",
    to: "21:00",
    desc: "",
  },
  {
    type: "matiere",
    id: 14,
    title: "Pneumologie",
    date: "2023-07-28",
    from: "6:00",
    to: "8:00",
    desc: "",
  },
  {
    type: "item",
    id: 1,
    title: "188. Endocardite infectieuse",
    date: "2023-07-28",
    from: "13:00",
    to: "14:00",
    desc: "here some description you added",
  },
  {
    type: "item",
    id: 2,
    title: "152. Endocardite infectieuse",
    date: "2023-07-28",
    from: "17:00",
    to: "18:00",
    desc: "",
  },
];

const useSchedule = () => {
  const [today, setToday] = useState(startOfToday());
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [firstDayCurrentMonth, setFirstDayCurrentMonth] = useState(
    parse(currentMonth, "MMM-yyyy", new Date())
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
    [selectedDay]
  );
  const weeklyEvents = useMemo(
    () =>
      events.filter((event) =>
        isSameWeek(parse(event.date, "yyyy-MM-dd", new Date()), selectedDay)
      ),
    [selectedDay]
  );
  const monthlyEvents = useMemo(
    () =>
      events.filter((event) =>
        isSameMonth(parse(event.date, "yyyy-MM-dd", new Date()), selectedDay)
      ),
    [selectedDay]
  );

  const previousDay = () => {};
  const nextDay = () => {};
  const previousWeek = () => {};
  const nextWeek = () => {};
  const previousMonth = () => {
    const firstDayPreviousMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPreviousMonth, "MMM-yyyy"));
    setFirstDayCurrentMonth(firstDayPreviousMonth);
  };
  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
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
    console.log(today, firstDayCurrentMonth, selectedDay);
  }, [today, firstDayCurrentMonth, selectedDay]);

  useEffect(() => {
    setInterval(() => {
      if (!isToday(today)) setToday(startOfToday());
    }, 60000);
  });
};
