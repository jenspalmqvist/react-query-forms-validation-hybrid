import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

type ApiRecipe = {
  title: string;
  description: string;
  imageUrl: string;
  timeInMins: number;
  categories: string[];
  instructions: string[];
  price: number;
  ingredients: Ingredient[];
};
type FormRecipe = {
  title: string;
  description: string;
  imageUrl: string;
  timeInMins: number;
  categories: Category[];
  instructions: Instruction[];
  price: number;
  ingredients: Ingredient[];
};

type Category = { value: string };

type Instruction = { value: string };

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};
export const RecipeView = () => {
  const getData = async () => {
    const response = await fetch("https://jens-recept-api.reky.se/recipes");
    return (await response.json()) as ApiRecipe[];
  };
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["Recipes"],
    queryFn: () => getData(),
    staleTime: 60000,
  });

  const mutateHeaders = new Headers();

  mutateHeaders.append("accept", "*/*");
  mutateHeaders.append("Content-Type", "application/json");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ApiRecipe) => {
      await fetch("https://jens-recept-api.reky.se/recipes", {
        method: "POST",
        body: JSON.stringify(data),
        headers: mutateHeaders,
      });
    },
    onMutate: (data) => console.log(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Recipes"] });
    },
  });

  const { register, handleSubmit, control } = useForm<FormRecipe>({
    defaultValues: {
      categories: [{ value: "" }],
      instructions: [{ value: "" }],
      ingredients: [{ name: "", amount: 0, unit: "" }],
    },
  });

  const { fields: categoryFields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "categories", // unique name for your Field Array
  });

  const { fields: instructionFields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "instructions", // unique name for your Field Array
  });

  const { fields: ingredientFields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "ingredients", // unique name for your Field Array
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
      {isLoading ? (
        <p>Loading Recipes</p>
      ) : (
        data && data.map((d) => <p>{d.title}</p>)
      )}
      <form onSubmit={handleSubmit(sendFormData)}>
        <label>Title</label>
        <input type="text" {...register("title")} required />
        <br />
        <label>Description</label>

        <input type="text" {...register("description")} />
        <br />
        <label>ImageUrl</label>

        <input type="text" {...register("imageUrl")} />
        <br />
        <label>TimeInMins</label>

        <input
          type="number"
          {...register("timeInMins", { valueAsNumber: true })}
        />
        <br />
        <label>Price</label>

        <input type="number" {...register("price", { valueAsNumber: true })} />
        <br />
        {categoryFields.map((category, index) => (
          <>
            <label>Category</label>

            <input
              key={"category" + index}
              {...register(`categories.${index}.value`)}
              defaultValue={category.value}
            />
            <br />
          </>
        ))}
        {instructionFields.map((instruction, index) => (
          <>
            <label>Intruction</label>
            <input
              key={"instruction" + index}
              {...register(`instructions.${index}.value`)}
              defaultValue={instruction.value}
            />
            <br />
          </>
        ))}
        {ingredientFields.map((ingredient, index) => (
          <>
            <label>IngredientName</label>
            <input
              key={"ingredientName" + index}
              {...register(`ingredients.${index}.name`)}
              defaultValue={ingredient.name}
            />
            <br />
            <label>IngredientAmount</label>
            <input
              type="number"
              key={"ingredientAmount" + index}
              {...register(`ingredients.${index}.amount`, {
                valueAsNumber: true,
              })}
              defaultValue={ingredient.amount}
            />
            <br />
            <label>IngredientUnit</label>
            <input
              key={"ingredientUnit" + index}
              {...register(`ingredients.${index}.unit`)}
              defaultValue={ingredient.unit}
            />
            <br />
          </>
        ))}
        <input type="submit" />
        {isPending ? (
          <p> Sending data! </p>
        ) : isSuccess ? (
          <p> Data sent! </p>
        ) : (
          <></>
        )}
      </form>
    </>
  );
};
