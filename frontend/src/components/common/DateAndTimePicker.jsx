import { CalendarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import DatePicker from "tailwind-datepicker-react";

const DateAndTimePicker = ({ date, setDate }) => {
  const [show, setShow] = useState(false);
  const options = {
    autoHide: true,
    todayBtn: true,
    clearBtn: true,
    inputDateFormatProp: {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
    theme: {
      background: "",
      todayBtn: "bg-primary-600",
      clearBtn: "",
      icons: "",
      text: "",
      disabledText: "",
      input: "",
      inputIcon: "",
      selected: "bg-primary-600",
    },
  };
  return (
    <DatePicker
      show={show}
      setShow={(state) => setShow(state)}
      options={options}
      onChange={(date)=>{console.log(date)}}
      classNames="mt-2"
    >
      <div className="">
        <input
          type="text"
          className="relative block w-full rounded-none rounded-r-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
          placeholder="Select Date"
          value={date}
          onFocus={() => setShow(true)}
          readOnly
        />
      </div>
    </DatePicker>
  );
};

export default DateAndTimePicker;
