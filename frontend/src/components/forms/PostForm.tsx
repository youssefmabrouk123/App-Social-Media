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
import { PostValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUploader from "../shared/FileUploader";
import axios from "axios";
import { useState } from "react";

type PostFormProps = {
  post?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: post ? post.tags.join(",") : "",
    },
  });


  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    console.log(value);
    console.log(value.file[0]);
    
    try {
      // Create FormData object to send multipart form data
      let newPost:Boolean=false;


      const formData = new FormData();
      formData.append('userid',user.id);
      formData.append('caption', value.caption);
      formData.append('location', value.location);
      formData.append('tags', value.tags);
      formData.append('file', value.file[0]);

  
      // Axios POST request to the API endpoint
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('http://localhost:8080/posts/create', formData,{
        headers: {
          Authorization: `Bearer ${token}` // Include the Authorization header with the JWT token
        }
      });
      
    
      
      
      console.log(response);
      if(response.data==!"Post created successfully"){
          toast({
            title :'Please try again'
          })
      }else{
        toast({
          title :'Post created successfully ✔'
        })

      }
      // If successful, return success message
      navigate('/');
    } catch (error:any) {
      toast({
        title :'Please try again'
      })
      navigate('/');

      // If error occurs, throw the error
      throw error.response.data || error.message;
      
      
    }
  }

  //////////////////////////////////////////////////////////////////////////////////
    // // ACTION = UPDATE
    // if (post && action === "Update") {
    //   const updatedPost = await updatePost({
    //     ...value,
    //     postId: post.$id,
    //     imageId: post.imageId,
    //     imageUrl: post.imageUrl,
    //   });

    //   if (!updatedPost) {
    //     toast({
    //       title: `${action} post failed. Please try again.`,
    //     });
    //   }
    //   return navigate(`/posts/${post.$id}`);
    // }

    // // ACTION = CREATE
    // const newPost = await createPost({
    //   ...value,
    //   userId: user.id,
    // });

    // if (!newPost) {
    //   toast({
    //     title: `${action} post failed. Please try again.`,
    //   });
    // }
    // navigate("/");
  
    // try {
    //     const response = await axios.post("http://localhost:8080/auth/create", value);
    //     console.log(response);

    //     console.log(response.data);
    //     } catch (error:any) {
    //     console.error(error.response.data);
       //////////////////////////////////////////////////////////////////////////////
  
  

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
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
            onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            >Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
