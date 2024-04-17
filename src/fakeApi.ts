export type Category = "movies" | "books";

const timeout = async () => {
  return new Promise((res) =>
    setTimeout(() => {
      res("");
    }, Math.random() * 5000)
  );
};
export const fakeApi = async (category: Category | undefined) => {
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
