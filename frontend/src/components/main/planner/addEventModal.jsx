import { useState } from "react";
import { format, parse } from "date-fns";
import Modal from "../../common/Modal";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Combobox } from "@headlessui/react";
import useAuthHttpClient from "../../../hooks/useAuthHttpClient";
import { useAuth } from "../../../providers/authProvider";
import { Spinner } from "../../icons/Spinner";
import { useNotification } from "../../../providers/notificationProvider";
import { useData } from "../../../providers/learningDataProvider";
import DatePicker from "tailwind-datepicker-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function AddEventModal({ open, setOpen, events, setEvents }) {
  const { user } = useAuth();
  const authHttpClient = useAuthHttpClient();
  const { showNotification } = useNotification();

  const [date, setDate] = useState();
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [itemType, setType] = useState("Matiere"); // Matiere, Item
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    if (validate()) {
      submit();
    }
  };

  const addEvent = (event) => {
    const tempEvents = [...events];
    tempEvents.push(parseEvent(event));
    setEvents(tempEvents);
  };

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

  const submit = async () => {
    setUploading(true);
    try {
      const response = await authHttpClient.post("/schedule/", {
        from: parse(`${date}:${from}`, "yyyy-MM-dd:HH:mm", new Date()),
        to: parse(`${date}:${to}`, "yyyy-MM-dd:HH:mm", new Date()),
        user_id: user._id,
        MatiereOrItem: itemType,
        matiere_or_item_id:
          itemType === "Matiere" ? selectedMatiere._id : selectedItem._id,
      });
      addEvent(response.data.data);
      setOpen(false);
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const validate = () => {
    const regexForDate = /^\d{4}-\d{2}-\d{2}$/;
    const regexForTime = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
    const fromDateTime = new Date(`2000-01-01T${from}:00.000Z`);
    const toDateTime = new Date(`2000-01-01T${to}:00.000Z`);

    if (!regexForDate.test(date)) {
      showNotification("Date input is not in correct format!");
      return false;
    }
    if (!regexForTime.test(from) || !regexForTime.test(to)) {
      showNotification("Time input is not in correct format!");
      return false;
    }
    if (toDateTime <= fromDateTime) {
      showNotification("Time input is not in correct format!");
      return false;
    }
    if (itemType === "Matiere") {
      if (!selectedMatiere) {
        showNotification("Please select matere!");
        return false;
      }
    } else {
      if (!selectedItem) {
        showNotification("Please select item!");
        return false;
      }
    }
    return true;
  };

  const { matieres, items } = useData();
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [matiereQuery, setMatiereQuery] = useState("");
  const filteredMatieres =
    matiereQuery === ""
      ? matieres
      : matieres.filter((matiere) => {
          return matiere.name
            .toLowerCase()
            .includes(matiereQuery.toLowerCase());
        });

  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQuery, setItemQuery] = useState("");
  const filteredItems =
    itemQuery === ""
      ? items.filter(
          (item) => !selectedMatiere || item.matiere_id === selectedMatiere._id
        )
      : items.filter((item) => {
          return (
            (item.name.toLowerCase().includes(itemQuery.toLowerCase()) ||
              String(item.item_number).includes(itemQuery.toLowerCase())) &&
            (!selectedMatiere || item.matiere_id === selectedMatiere._id)
          );
        });

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
    <Modal open={open} setOpen={setOpen}>
      <div className="bg-white rounded-xl p-8 border-2 border-gray-400 w-[400px]">
        <input type="text" autofocus="true" className="sr-only" />
        <fieldset>
          <legend className="block text-sm font-medium leading-6 text-gray-900">
            Date and Time
          </legend>

          <div className="mt-2 -space-y-px rounded-md bg-white shadow-sm">
            <div>
              <label htmlFor="card-number" className="sr-only">
                date
              </label>
              <DatePicker
                show={show}
                setShow={(state) => setShow(state)}
                options={options}
                onChange={(value) => {
                  setDate(format(value, "yyyy-MM-dd"));
                }}
              >
                <input
                  type="text"
                  name="date"
                  id="date"
                  value={date}
                  onFocus={() => {
                    setShow(true);
                  }}
                  className="relative block w-full rounded-none rounded-t-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder={format(Date.now(), "yyyy-MM-dd")}
                  readOnly
                />
              </DatePicker>
            </div>
            <div className="flex -space-x-px">
              <div className="w-1/2 min-w-0 flex-1">
                <label htmlFor="from" className="sr-only">
                  from
                </label>
                <select
                  name="from"
                  id="from"
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                  }}
                  class="block w-full rounded-bl-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                <option>00:00</option>
                <option>01:00</option>
                <option>02:00</option>
                <option>03:00</option>
                <option>04:00</option>
                <option>05:00</option>
                <option>06:00</option>
                <option>07:00</option>
                <option>08:00</option>
                <option>09:00</option>
                <option>10:00</option>
                <option>11:00</option>
                <option>12:00</option>
                <option>13:00</option>
                <option>14:00</option>
                <option>15:00</option>
                <option>16:00</option>
                <option>17:00</option>
                <option>18:00</option>
                <option>19:00</option>
                <option>20:00</option>
                <option>21:00</option>
                <option>22:00</option>
                <option>23:00</option>
                </select>
              </div>
              <div className="min-w-0 flex-1">
                <label htmlFor="to" className="sr-only">
                  to
                </label>
                {/* <input
                  type="text"
                  name="to"
                  id="to"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                  }}
                  className="relative block w-full rounded-none rounded-r-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                  placeholder={format(Date.now() + 60 * 60 * 1000, "HH:00")}
                /> */}
                <select
                  name="to"
                  id="to"
                  value={to}
                  onChange={(e) => {
                    setTo(e.target.value);
                  }}
                  class="block w-full rounded-br-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option>00:00</option>
                  <option>01:00</option>
                  <option>02:00</option>
                  <option>03:00</option>
                  <option>04:00</option>
                  <option>05:00</option>
                  <option>06:00</option>
                  <option>07:00</option>
                  <option>08:00</option>
                  <option>09:00</option>
                  <option>10:00</option>
                  <option>11:00</option>
                  <option>12:00</option>
                  <option>13:00</option>
                  <option>14:00</option>
                  <option>15:00</option>
                  <option>16:00</option>
                  <option>17:00</option>
                  <option>18:00</option>
                  <option>19:00</option>
                  <option>20:00</option>
                  <option>21:00</option>
                  <option>22:00</option>
                  <option>23:00</option>
                </select>
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset className="mt-6 bg-white">
          <legend className="block text-sm font-medium leading-6 text-gray-900">
            What are you planning to do?
          </legend>
          <div className="mt-2 mb-4 -space-y-px rounded-md shadow-sm">
            <div className="grid grid-cols-2 border-2 border-primary-600 divide-x-2 divide-primary-600 rounded-lg">
              <div
                onClick={() => setType("Matiere")}
                className={classNames(
                  "text-center hover:cursor-pointer rounded-l block text-sm leading-6 text-gray-900 py-1 px-3",
                  itemType === "Matiere" && "bg-primary-600 text-white"
                )}
              >
                Matiere
              </div>
              <div
                onClick={() => setType("Item")}
                className={classNames(
                  "hover:cursor-pointer text-center block text-sm leading-6 text-gray-900 py-1 px-3",
                  itemType === "Item" && "bg-primary-600 text-white"
                )}
              >
                Item
              </div>
            </div>
            <div>
              {/*   select matiere   */}
              <Combobox
                as="div"
                value={selectedMatiere}
                onChange={(matiere) => {
                  setSelectedItem(null);
                  setSelectedMatiere(matiere);
                }}
              >
                <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                  Select Matiere
                </Combobox.Label>
                <div className="relative">
                  <Combobox.Input
                    className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                    onChange={(event) => setMatiereQuery(event.target.value)}
                    displayValue={(matiere) => matiere?.name}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>

                  {filteredMatieres.length > 0 && (
                    <Combobox.Options className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredMatieres.map((matiere) => (
                        <Combobox.Option
                          key={matiere._id}
                          value={matiere}
                          className={({ active }) =>
                            classNames(
                              "relative cursor-default select-none py-2 pl-3 pr-9",
                              active
                                ? "bg-primary-600 text-white"
                                : "text-gray-900"
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <>
                              <div className="flex items-center">
                                <img
                                  src={matiere.image}
                                  alt={matiere.name}
                                  className="h-6 w-6 flex-shrink-0 rounded-full"
                                />
                                <span
                                  className={classNames(
                                    "ml-3 truncate",
                                    selected && "font-semibold"
                                  )}
                                >
                                  {matiere.name}
                                </span>
                              </div>

                              {selected && (
                                <span
                                  className={classNames(
                                    "absolute inset-y-0 right-0 flex items-center pr-4",
                                    active ? "text-white" : "text-primary-600"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}
                </div>
              </Combobox>
              {/*   select item    */}
              {itemType === "Item" && (
                <Combobox
                  as="div"
                  value={selectedItem}
                  onChange={(item) => {
                    setSelectedMatiere(
                      matieres.find(({ _id }) => _id === item.matiere_id)
                    );
                    setSelectedItem(item);
                  }}
                >
                  <Combobox.Label className="mt-2 text-left block text-sm font-medium leading-6 text-gray-900">
                    Select Item
                  </Combobox.Label>
                  <div className="relative">
                    <Combobox.Input
                      className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      onChange={(event) => setItemQuery(event.target.value)}
                      displayValue={(item) =>
                        item && `${item.item_number}. ${item.name}`
                      }
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>

                    {filteredItems.length > 0 && (
                      <Combobox.Options className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredItems.map((item) => (
                          <Combobox.Option
                            key={item._id}
                            value={item}
                            className={({ active }) =>
                              classNames(
                                "relative cursor-default select-none py-2 pl-3 pr-9",
                                active
                                  ? "bg-primary-600 text-white"
                                  : "text-gray-900"
                              )
                            }
                          >
                            {({ active, selected }) => (
                              <>
                                <div className="flex items-center">
                                  <span
                                    className={classNames(
                                      "ml-3 truncate",
                                      selected && "font-semibold"
                                    )}
                                  >
                                    {`${item.item_number}. ${item.name}`}
                                  </span>
                                </div>

                                {selected && (
                                  <span
                                    className={classNames(
                                      "absolute inset-y-0 right-0 flex items-center pr-4",
                                      active ? "text-white" : "text-primary-600"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </div>
                </Combobox>
              )}
            </div>
          </div>
        </fieldset>
        <fieldset className="mt-6 bg-white">
          <div>
            <button
              onClick={() => {
                handleClick();
              }}
              type="button"
              className="flex mt-8 w-full justify-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
            >
              {uploading ? <Spinner small center /> : "Add"}
            </button>
          </div>
        </fieldset>
      </div>
    </Modal>
  );
}
