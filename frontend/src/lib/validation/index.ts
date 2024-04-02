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


export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 characters." }).max(2200, { message: "Maximum 2,200 caracters" }),
  file: z.custom<File[]>(),
  location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
  tags: z.string(),
});
////
// ============================================================
// Profil
// ============================================================
// export const ProfilValidation = z.object({
//   file: z.custom<File[]>(),
//   firstname: z.string().min(3,{ message: "This field is required" }).max(50),
//   lastname: z.string().min(3,{ message: "This field is required" }).max(50),
//   age: z.number().min(18).max(100),
//   bio: z.string().min(2).max(500),
//   filiere: z.string().min(2).max(100),
// });

export const ProfilValidation = z.object({
  
  firstname: z.string().min(3,{ message: "This field is required" }).max(50),
  lastname: z.string().min(3,{ message: "This field is required" }).max(50),
  age: z.string().min(2,{ message: "go home baby this is an engineer school" }),
  bio: z.string().min(2).max(500),
  filiere: z.string().min(2).max(100),
  file: z.custom<File[]>(),
});
