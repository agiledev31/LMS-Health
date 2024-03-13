import { createContext, useContext, useEffect, useState } from "react";
import useAuthHttpClient from "../hooks/useAuthHttpClient";

const DataContext = createContext({});
export const DataProvider = (props) => {
  const authHttpClient = useAuthHttpClient();
  const [loading, setLoading] = useState(true);

  const [sessions, setSessions] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [items, setItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [cards, setCards] = useState([]);
  const [dps, setDps] = useState([]);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let response;
      response = await authHttpClient.get(`/session/`);
      setSessions(response.data.data);
      response = await authHttpClient.get(`/matiere/`);
      setMatieres(response.data.data);
      response = await authHttpClient.get(`/item`);
      setItems(response.data.data);
      response = await authHttpClient.get(`/tag/`);
      setTags(response.data.data);
      response = await authHttpClient.get(`/card/withOutContent`);
      setCards(response.data.data);
      response = await authHttpClient.get("/dp");
      setDps(response.data.data);
      response = await authHttpClient.get("/question");
      setQuestions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const value = {
    sessions,
    setSessions,
    matieres,
    setMatieres,
    items,
    setItems,
    tags,
    setTags,
    cards,
    setCards,
    loading,
    dps,
    questions,
  };

  return (
    <DataContext.Provider value={value}>{props.children}</DataContext.Provider>
  );
};

export function useData() {
  return useContext(DataContext);
}
