import "./App.css";
import { FavoritesWithFetchAndUseEffect } from "./FavoritesWithFetchAndUseEffect";
import { FavoritesWithUseQuery } from "./FavoritesWithUseQuery";
import { PersonForm } from "./PersonForm";

function App() {
  return (
    <>
      <FavoritesWithFetchAndUseEffect />
      <FavoritesWithUseQuery />
      <PersonForm />
    </>
  );
}

export default App;
