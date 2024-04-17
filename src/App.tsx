import "./App.css";
import { FavoritesWithFetchAndUseEffect } from "./FavoritesWithFetchAndUseEffect";
import { FavoritesWithUseQuery } from "./FavoritesWithUseQuery";

function App() {
  return (
    <>
      <FavoritesWithFetchAndUseEffect />
      <FavoritesWithUseQuery />
    </>
  );
}

export default App;
