import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PostValidation, ProfilValidation, VoteValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUploader from "../shared/FileUploader";
import axios from "axios";
import { useState } from "react";

const VoteForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user , profileImage } = useUserContext();
  const form = useForm<z.infer<typeof VoteValidation>>({
    resolver: zodResolver(VoteValidation),
    defaultValues: {
      question:"",
      description:"",
    },
  });
  
  // Handler
  const handleSubmit = async (value: z.infer<typeof VoteValidation>) => {

    try {
      // Create FormData object to send multipart form data

      const formData = new FormData();
      formData.append("question", value.question);
      formData.append("description", value.description);
      

      // Axios POST request to the API endpoint
     // const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `http://localhost:8080/users/api/votes/${user.id}`,
        formData
      );

      console.log(response);
      if (response.data == !"Post created successfully") {
        toast({
          title: "Please try again ",
        });
      } else {
        toast({
          title: "Vote Created successfully ✔",
        });
      }
      // If successful, return success message
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Please try again",
      });
      //navigate('/');

      // If error occurs, throw the error
      throw error.response.data || error.message;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
      >
       

       
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">question</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  {...field}
                  //defaultValue={user.firstname}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">description</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                  //defaultValue={user.bio}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />


        

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VoteForm;
