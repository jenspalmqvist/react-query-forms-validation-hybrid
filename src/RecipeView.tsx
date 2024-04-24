import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

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

type FormRecipe = {
  title: string;
  description: string;
  imageUrl: string;
  timeInMins: number;
  categories: FormCategory[];
  instructions: FormInstruction[];
  ingredients: Ingredient[];
  price: number;
};

type FormCategory = { value: string };

type FormInstruction = { value: string };

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

  const postRecipe = async (recipe: ApiRecipe) => {
    const mutationHeaders = new Headers();
    mutationHeaders.append("accept", "*/*");
    mutationHeaders.append("Content-Type", "application/json");

    await fetch("https://jens-recept-api.reky.se/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
      headers: mutationHeaders,
    });
  };

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: ApiRecipe) => postRecipe(data),
    onMutate: (data) => console.log(data),
  });

  const { register, handleSubmit, control } = useForm<FormRecipe>({
    defaultValues: {
      categories: [{ value: "" }],
      instructions: [{ value: "" }],
      ingredients: [{ name: "", amount: 0, unit: "" }],
    },
  });

  const { fields: ingredientFields } = useFieldArray({
    control,
    name: "ingredients",
  });

  const { fields: categoryFields } = useFieldArray({
    control,
    name: "categories",
  });

  const { fields: instructionFields } = useFieldArray({
    control,
    name: "instructions",
  });

  const mapRecipe = (data: FormRecipe): ApiRecipe => {
    return {
      ...data,
      categories: data.categories.map((c) => c.value),
      instructions: data.instructions.map((i) => i.value),
    };
  };
  const sendFormData: SubmitHandler<FormRecipe> = (data) =>
    mutate(mapRecipe(data));

  return (
    <>
      <h3>New recipe form:</h3>
      <form onSubmit={handleSubmit(sendFormData)}>
        <label>Title</label>
        <input {...register("title")} />
        <br />
        <label>Description</label>
        <input {...register("description")} />
        <br />
        <label>imageUrl</label>
        <input {...register("imageUrl")} />
        <br />
        <label>timeInMins</label>
        <input {...register("timeInMins")} />
        <br />
        <label>price</label>
        <input {...register("price")} />
        <br />
        <label>Instructions:</label>
        {instructionFields.map((instruction, index) => (
          <input
            key={"Instruction" + index}
            {...register(`instructions.${index}.value`)}
          />
        ))}
        <br />
        <label>categories</label>
        {categoryFields.map((category, index) => (
          <input
            key={"Category" + index}
            {...register(`categories.${index}.value`)}
          />
        ))}
        <br />
        <label>ingredients</label>
        {ingredientFields.map((ingredient, index) => (
          <>
            <input
              key={"ingredientName" + index}
              {...register(`ingredients.${index}.name`)}
            />
            <input
              key={"ingredientAmount" + index}
              {...register(`ingredients.${index}.amount`)}
            />
            <input
              key={"ingredientUnit" + index}
              {...register(`ingredients.${index}.unit`)}
            />
          </>
        ))}
        <br />
        <input type="submit" />
        {isPending ? (
          <p>Sending recipe</p>
        ) : isSuccess ? (
          <>Recipe sent succesfully</>
        ) : (
          <></>
        )}
      </form>
      <h3>Recipes:</h3>
      <ul>
        {data && data.length > 0 ? (
          data.map((recipe, index) => <li key={index}>{recipe.title}</li>)
        ) : (
          <li>No recipes!</li>
        )}
      </ul>
    </>
  );
};
