import { useEffect, useState } from "react";
import { Category, fakeApiGet } from "./fakeApi";

export const FavoritesWithFetchAndUseEffect = () => {
  const [category, setCategory] = useState<Category>();
  const [data, setData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Den här variabeln är unik för varje instans av useEffect som körs
    // om en ny useEffect körs på grund av att category ändras så sätts
    // 'ignore' till true i return-blocket längst ner i den pågående useEffecten
    // 'ignore' kommer alltid att vara false i den senaste useEffecten som körs
    let ignore = false;
    try {
      setIsLoading(true);
      const getData = async () => {
        if (category) {
          const apiData = await fakeApiGet(category);
          if (!ignore) {
            setData(apiData);
            setIsLoading(false);
            setError("");
          } else {
            console.log("Response ignored");
          }
        }
      };
      getData();
    } catch {
      setError("Fel!");
    }
    return () => {
      ignore = true;
    };
  }, [category]);

  return (
    <div>
      <h2>With fetch in useEffect</h2>
      <button onClick={() => setCategory("books")}>Books</button>
      <button onClick={() => setCategory("movies")}>Movies</button>
      <p>Current category: {category}</p>
      {isLoading ? (
        <p>Loading!</p>
      ) : (
        data.map((d, index) => <p key={index}>{d}</p>)
      )}
      {error && <p>{error}</p>}
    </div>
  );
};
