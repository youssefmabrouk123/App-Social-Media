import { z, SuperRefinement } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Too short" }),
  username: z.string().min(2, { message: "Too short" }),
  mail: z.string()
    .email({ message: "Invalid email format" })
    .refine((value) => value.endsWith("@ensit.u-tunis.tn"), {
      message: "Email must end with '@ensit.u-tunis.tn'",
    }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});