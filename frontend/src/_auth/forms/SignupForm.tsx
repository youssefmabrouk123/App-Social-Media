import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from '@/lib/validation'
import { z } from 'zod'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from "@/components/ui/use-toast"
import axios from 'axios'
import { ToastAction } from '@radix-ui/react-toast'
import { useState } from 'react'
import { useUserContext } from '@/context/AuthContext'




const SignupForm = () => {
  let navigate=useNavigate()
  const {accessToken ,setAccessToken,refreshToken,setRefreshToken } = useUserContext();
  console.log()
  console.log("accessToken");
  console.log(accessToken);
  console.log("000000000000");
  console.log(refreshToken);
  console.log("accessToken");


  const { toast } = useToast()

  const [isLoading,setIsLoading]=useState(false)

    // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      role:"USER",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    setIsLoading(true);
    console.log(values);

    try {
        const response = await axios.post("http://localhost:8080/auth/signup", values);
        console.log(response);

        console.log(response.data);
        toast({
          variant: "destructive",
          title: "Success Sign Up",
          description: response.data.message,
          
        }) 
        navigate('/sign-in');
        // Logging the response data
    } catch (error:any) {
        console.error(error.response.data);
        toast({
          variant: "destructive",
          title: "Failed Sign Up",
          description: error.response.data,
          
        }) // Logging the error response data
    } finally {
        setIsLoading(false); // Ensuring isLoading is set to false after request completes
    }
}

    
     
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
      <img src="/assets/images/ednet-high-resolution-logo-transparent.png" alt="logo" width={330} />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
           Please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Firstname</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Lastname</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              "Sign Up"
            )}  
            
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;