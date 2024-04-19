import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SigninValidation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUserLoading, setIsUserLoading] = useState(false);
  const {  checkAuthUser, isLoading , accessToken ,setAccessToken,refreshToken,setRefreshToken ,user } = useUserContext();

  // Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define a submit handler.
  // async function onSubmit(values: z.infer<typeof SigninValidation>) {
  //   setIsUserLoading(true);
  //   try {
  //     const response = await axios.post("http://localhost:8080/auth/signin", values);
  //     console.log(response); // Logging the response data
  //     toast({
  //       variant: "destructive",
  //       title: "Success Sign In",
  //       description: "You have successfully signed in.",
  //     });
  //     // Redirect to home page upon successful sign-in
  //     window.location.href = "/";
  //   } catch (error:any) {
  //     console.error(error.response?.data || error.message);
  //     toast({
  //       variant: "destructive",
  //       title: "Failed Sign In",
  //       description: error.response?.data || "Failed to sign in.",
  //     });
  //   } finally {
  //     setIsUserLoading(false);
  //   }
  // }

  
// async function onSubmit(values:z.infer<typeof SigninValidation>) {
//   setIsUserLoading(true);
//   try {
//     const response = await axios.post("http://localhost:8080/auth/signin", values);
//     const { accessToken, refreshToken } = response.data;

//     // Store tokens securely (e.g., in localStorage)
//     localStorage.setItem('accessToken', accessToken);
//     localStorage.setItem('refreshToken', refreshToken);

//     // Redirect to home page upon successful sign-in
//     window.location.href = "/";

//   } catch (error:any) {
//     console.error(error.response?.data || error.message);
//     toast({
//       variant: "destructive",
//       title: "Failed Sign In",
//       description: error.response?.data || "Failed to sign in.",
//     });

//   } finally {
//     setIsUserLoading(false);
//   }
// }

var aToken:any;
var rToken:any;

useEffect(() => {
  setAccessToken(()=>aToken);
setRefreshToken(()=>rToken);
}, [aToken,rToken]);

const handleSignin = async (users: z.infer<typeof SigninValidation>) => {
        const response = await axios.post("http://localhost:8080/auth/signin", users);
        console.log(response.data);
    
        // Store tokens securely (e.g., in localStorage)
        localStorage.setItem('accessToken', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);

        aToken=response.data.token;
        rToken=response.data.refreshToken;
        setAccessToken(()=>response.data.token);
        setRefreshToken(()=>response.data.refreshToken);
        


        //console.log(accessToken)
        //ALERT PROBLEM
        if (response.data.token==="") {
          toast({ title: "Login failed. Please try again." });
          
          return;
        }
        const isLoggedIn = await checkAuthUser();

        if (isLoggedIn) {
          form.reset();
           console.log("-----------");
           console.log(user);
           console.log(accessToken);


           console.log("-----------");

          navigate("/");
        } else {
          toast({ title: "Login failed. Please try again...", });
          
          return;
        }
      }






  return (
    // <Form {...form}>
    //   <div className="sm:w-420 flex-center flex-col">
    //     <img src="/assets/images/ednet-high-resolution-logo-transparent.png" alt="logo" />
    //     <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Login to your account</h2>
    //     <p className="text-light-3 small-medium md:base-regular mt-2">Welcome back!</p>
    //     <form onSubmit={form.handleSubmit(handleSignin)} className="flex flex-col gap-5 w-full mt-4">
    //       <FormField
    //         control={form.control}
    //         name="email"
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel className="shad-form_label">Email</FormLabel>
    //             <FormControl>
    //               <Input type="email" className="shad-input" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <FormField
    //         control={form.control}
    //         name="password"
    //         render={({ field }) => (
    //           <FormItem>
    //             <FormLabel className="shad-form_label">Password</FormLabel>
    //             <FormControl>
    //               <Input type="password" className="shad-input" {...field} />
    //             </FormControl>
    //             <FormMessage />
    //           </FormItem>
    //         )}
    //       />
    //       <Button type="submit" className="shad-button_primary">
    //         {isLoading ? (
    //           <div className="flex-center gap-2"><Loader />Loading ...</div>
    //         ) : "Sign In"}
    //       </Button>
    //       <p className="text-small-regular text-light-2 text-center mt-2">
    //         Don't have an account? <Link to="/sign-up" className="text-primary-500 text-small-semibold">Sign up</Link>
    //       </p>
    //     </form>
    //   </div>
    // </Form>
    <Form {...form}>
    <div className="sm:w-420 flex-center flex-col">
    <img src="/assets/images/ednet-high-resolution-logo-transparent.png" alt="logo" width={330} />

      <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
      Login to your account
      </h2>
      <p className="text-light-3 small-medium md:base-regular mt-2">
      Welcome back!
      </p>

      <form
        onSubmit={form.handleSubmit(handleSignin)}
        className="flex flex-col gap-5 w-full mt-4">
     
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="shad-button_primary" variant="outline">
            {isLoading ? (
            <div className="flex-center gap-2">
              <Loader /> Loading...
            </div>
          ) : (
            "Log In"
          )}  
          
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2">
             Don't have an account? <Link to="/sign-up" className="text-primary-500 text-small-semibold">Sign up</Link>
           </p>
      </form>
    </div>
  </Form>
  );
};

export default SigninForm;
