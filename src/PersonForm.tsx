import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { fakeApiPost } from "./fakeApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const PersonSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    age: z.number().positive().min(18),
    email: z.string().email().or(z.literal("")),
    phone: z.string().min(8).or(z.literal("")),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone needs to be valid",
  });

export type PersonFormType = z.infer<typeof PersonSchema>;

export const PersonForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonFormType>({ resolver: zodResolver(PersonSchema) });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (data: PersonFormType) => await fakeApiPost(data),
    onSuccess: () => console.log("Success!"),
  });

  const sendFormData: SubmitHandler<PersonFormType> = (data) => mutate(data);

  console.log(errors);
  return (
    <form onSubmit={handleSubmit(sendFormData)}>
      <input type="text" {...register("firstName")} />
      <input type="text" {...register("lastName")} />
      <input type="number" {...register("age", { valueAsNumber: true })} />
      <input type="text" {...register("email")} />
      <input type="text" {...register("phone")} />
      <input type="submit" />
      {isPending ? (
        <p> Sending data! </p>
      ) : isSuccess ? (
        <p> Data sent! </p>
      ) : (
        <></>
      )}
    </form>
  );
};
