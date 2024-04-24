import { useMutation, useQuery } from "@tanstack/react-query";

type ApiRecipe = {
  title: string;
  description: string;
  imageUrl: string;
  timeInMins: number;
  categories: string[];
  instructions: string[];
  ingredients: Ingredient[];
  price: number;
};

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};

// type FormRecipe = {};

export const RecipeView = () => {
  const getRecipes = async () => {
    const response = await fetch("https://jens-recept-api.reky.se/recipes");
    const data: ApiRecipe[] = await response.json();
    return data;
  };

  const { data } = useQuery({
    queryKey: ["Recipes"],
    queryFn: () => getRecipes(),
  });
  const { isPending } = useMutation({ mutationFn: async () => {} });
  console.log(isPending);
  return (
    <>
      <h3>Recipes:</h3>
      <ul>
        {data &&
          data.map((recipe, index) => <li key={index}>{recipe.title}</li>)}
      </ul>
    </>
  );
};
