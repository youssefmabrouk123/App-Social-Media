import { z } from "zod";

export const SignupValidation = z.object({
  firstname: z.string().min(2, { message: "Too short" }),
  lastname: z.string().min(2, { message: "Too short" }),
  email: z.string()
    .email({ message: "Invalid email format" })
    .refine((value) => value.endsWith("@ensit.u-tunis.tn"), {
      message: "Please use your university's email ( ..@ensit.u-tunis.tn )",
    }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  role: z.string().min(3,{ message: 'Too short'}),
});


export const SigninValidation = z.object({
   
  email: z.string().email(),
  password: z.string().min(8,{ message: 'password must be at least 8 character.'}),

})


// export const ProfileValidation = z.object({
//   file: z.custom<File[]>(),
//   name: z.string().min(2, { message: "Name must be at least 2 characters." }),
//   username: z.string().min(2, { message: "Name must be at least 2 characters." }),
//   email: z.string().email(),
//   bio: z.string(),
// });

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().max(500, { message: "Maximum 500 caracters" }),
  file: z.custom<File[]>(),
  location: z.string().max(30, { message: "Maximum 30 characters." }),
  tags: z.string(),
});
////


export const ProfilValidation = z.object({
  
  firstname: z.string().min(3,{ message: "This field is required" }).max(50),
  lastname: z.string().min(3,{ message: "This field is required" }).max(50),
  birthDate: z.string().min(9,{ message: "Please let date be like : YYYY-MM-DD" }).max(11),
  //age: z.string().min(2,{ message: "Your age must be above 18 !" }).max(30),
  bio: z.string().max(500),
  filiere: z.string(),
  file: z.custom<File[]>(),
});


export const VoteValidation = z.object({
  question: z.string().min(3,{ message: "This field is required" }).max(80),
  description: z.string().min(2).max(500),
});
//////////////
export const EventValidation = z.object({
  eventName: z.string().min(10).max(30, { message: "Min 10 and Maxi 30 characters" }),
  eventDescription: z.string().max(500, { message: "Maximum 500 characters" }),
  location: z.string().max(30, { message: "Maximum 30 characters" }),
  organizer: z.string().max(30, { message: "Maximum 30 characters" }),
  eventDate:  z.string().min(8).max(18, { message: "Enter a valide date : YYYY-MM-DD HH:MIN " }),
  file: z.custom<File[]>(),
});
///////////////
