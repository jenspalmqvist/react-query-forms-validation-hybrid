import { PersonFormType } from "./PersonForm";

export type Category = "movies" | "books";

const timeout = async () => {
  return new Promise((res) =>
    setTimeout(() => {
      res("");
    }, Math.random() * 2000)
  );
};
export const fakeApiGet = async (category: Category | undefined) => {
  if (category === "movies") {
    await timeout();
    console.log("Hej?");
    return ["Cool runnings", "Dumb & Dumber", "Flash Gordon"];
  } else if (category === "books") {
    await timeout();
    return [
      "Gula sidorna",
      "Telefonkatalogen 1976",
      "Learn to read - For dummies",
    ];
  }
  return [];
};

export const fakeApiPost = (data: PersonFormType) => {
  timeout();
  console.log(data);
};
