import { useState } from "react";
import { Category, fakeApiGet } from "./fakeApi";
import { useQuery } from "@tanstack/react-query";

export const FavoritesWithUseQuery = () => {
  const [category, setCategory] = useState<Category>();

  // const getAndMutate = async () => {
  //   const response = ;
  //   return response.map((r) => r.toUpperCase());
  // };

  const { isLoading, error, data, refetch, isRefetching } = useQuery({
    queryKey: ["Favorites", category],
    queryFn: () => fakeApiGet(category),
    staleTime: 60000, // Hur gammal får datan vara innan vi hämtar den igen i millisekunder
  });

  return (
    <div>
      <h2>With fetch in useQuery</h2>
      <button onClick={() => setCategory("books")}>Books</button>
      <button onClick={() => setCategory("movies")}>Movies</button>
      <button onClick={() => refetch()}>Refetch</button>
      <p>Current category: {category}</p>
      {error ? (
        <p>{error.message}</p>
      ) : isLoading || isRefetching ? (
        <p>Loading!</p>
      ) : (
        data && data.map((d, index) => <p key={index}>{d}</p>)
      )}
    </div>
  );
};
