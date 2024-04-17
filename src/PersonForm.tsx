import { SubmitHandler, useForm } from "react-hook-form";

type PersonFormType = {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
};

export const PersonForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonFormType>();

  const sendFormData: SubmitHandler<PersonFormType> = (data) =>
    console.log(data);
  return (
    <form onSubmit={handleSubmit(sendFormData)}>
      <input
        type="text"
        {...register("firstName", {
          required: "Det här fältet är obligatoriskt",
          minLength: { value: 2, message: "Ange minst två tecken" },
        })}
      />
      {errors.firstName?.message && <p>{errors.firstName.message}</p>}
      <input type="text" {...register("lastName")} />
      <input type="number" {...register("age", { valueAsNumber: true })} />
      <input type="email" {...register("email")} />
      <input type="submit" />
    </form>
  );
};
