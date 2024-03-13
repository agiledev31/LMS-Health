import { createContext, useContext, useState } from "react";

const CardContext = createContext({});
export const CardProvider = (props) => {
  const [openCard, setOpenCard] = useState(false)
  const [card, setCard] = useState()

  const showCard = (card) => {
    setCard(card);
    setOpenCard(true);
  }

  const value = {
    openCard,
    setOpenCard,
    card,
    showCard,
  };

  return (
    <CardContext.Provider value={value}>{props.children}</CardContext.Provider>
  );
};

export function useCard() {
  return useContext(CardContext);
}