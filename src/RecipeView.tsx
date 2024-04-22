import { useMutation, useQuery } from "@tanstack/react-query";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

type Recipe = {
  title: string;
  description: string;
  ratings: number[];
  imageUrl: string;
  timeInMins: number;
  categories: string[];
  instructions: string[];
  price: number;
  ingredients: Ingredient[];
};

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};
export const RecipeView = () => {
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["Recipes"],
    queryFn: () => {
      fetch("https://jens-recept-api.reky.se/recipes");
    },
    staleTime: 60000,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Recipe) => {
      await fetch("https://jens-recept-api.reky.se/recipes", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Recipe>({ defaultValues: { categories: ["", "", ""] } });

  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormProvider)
    name: "categories", // unique name for your Field Array
  });
  const sendFormData: SubmitHandler<Recipe> = (data) => mutate(data);

  return (
    <>
      <form onSubmit={handleSubmit(sendFormData)}>
        <input type="text" {...register("title")} required />
        <input type="text" {...register("description")} />
        <input type="text" {...register("imageUrl")} />
        <input
          type="number"
          {...register("timeInMins", { valueAsNumber: true })}
        />
        <input type="number" {...register("price", { valueAsNumber: true })} />
        {fields.map((category, index) => (
          <input key={index} {...register(`categories.${index}`)} />
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
