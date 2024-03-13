import { createContext, useContext, useEffect, useState } from "react";

const NotificationContext = createContext({});
export const NotificationProvider = (props) => {
  const [openNotification, setOpenNotification] = useState(false);
  const [notificationText, setNotificationText] = useState();

  const [timer, setTimer] = useState();

  useEffect(() => {
    if (openNotification)
      setTimer(
        setTimeout(() => {
          setOpenNotification(false);
        }, 3000)
      );
    else clearTimeout(timer);
  }, [openNotification]);

  const showNotification = (text) => {
    if (!openNotification) {
      setNotificationText(text);
      setOpenNotification(true);
    } else {
      setOpenNotification(false);
      setTimeout(() => {
        setNotificationText(text);
        setOpenNotification(true);
      }, 200);
    }
  };

  const value = {
    openNotification,
    setOpenNotification,
    notificationText,
    showNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export function useNotification() {
  return useContext(NotificationContext);
}
