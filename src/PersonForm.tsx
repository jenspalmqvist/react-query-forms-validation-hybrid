import { useMutation } from "@tanstack/react-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { fakeApiPost } from "./fakeApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export type PersonFormType = z.infer<typeof PersonSchema>;

const PersonSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    age: z.number().positive().min(18).max(130),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(8).optional().or(z.literal("")),
    shoesize: z.number().min(7).max(60),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone needs to be provided",
  });

export const PersonForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonFormType>({ resolver: zodResolver(PersonSchema) });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async (person: PersonFormType) => await fakeApiPost(person),
    onSuccess: () => {
      console.log("Success!");
    },
    onMutate: () => {
      console.log("Starting!");
    },
  });

  console.log(errors);

  const sendFormData: SubmitHandler<PersonFormType> = (data) => mutate(data);

  return (
    <form onSubmit={handleSubmit(sendFormData)}>
      <input type="text" {...register("firstName")} />
      <input type="text" {...register("lastName")} />
      <input type="number" {...register("age", { valueAsNumber: true })} />
      <input type="email" {...register("email")} />
      <input type="text" {...register("phone")} />
      <input type="submit" />
      {isPending ? <p>Sending data!</p> : isSuccess ? <p>Data sent!</p> : <></>}
    </form>
  );
};
