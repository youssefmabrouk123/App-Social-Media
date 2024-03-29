import { z, SuperRefinement } from "zod";

export const SignupValidation = z.object({
  firstname: z.string().min(2, { message: "Too short" }),
  lastname: z.string().min(2, { message: "Too short" }),
  email: z.string()
    .email({ message: "Invalid email format" })
    .refine((value) => value.endsWith("@ensit.u-tunis.tn"), {
      message: "Email must end with '@ensit.u-tunis.tn'",
    }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.string().min(3,{ message: 'Too short'}),
});


export const SigninValidation = z.object({
   
  email: z.string().email(),
  password: z.string().min(8,{ message: 'password must be at least 8 character.'}),

})
