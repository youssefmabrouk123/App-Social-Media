import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
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
import { useEffect, useState } from "react";

type PostFormProps = {
  post?: Models.Document;
};


interface UserPost {
  postId: number;
  userId: number;
  interactions: number;
  caption: string;
  location: string;
  tags: string;
  imageData: ArrayBuffer;
  creationdate: string;
}

const UpdatePostForm  = ({ post }: PostFormProps) => {
  const [userPost, setUserPost] = useState<UserPost>();
  const [imageURL, setImageURL] = useState<string>('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [idPost, setIdPost] = useState<number>(parseInt(id));
  const { toast } = useToast();
  const { user } = useUserContext();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: "",
      file: [],
      location: "",
      tags: "",
    },
  });

  const arrayBufferToBase64 = (buffer: any) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {

    const fetchPostDetail = async (id: any) => {
      try {
        const response = await axios.get<UserPost>(`http://localhost:8080/users/posts/all/${id}`);
        const { data } = response;
        setUserPost(data);

        console.log("0000");
        console.log(data);

        const imageResponse = await axios.get(`http://localhost:8080/users/posts/image/${id}`, {
          responseType: 'arraybuffer'
        });
        const base64Image = arrayBufferToBase64(imageResponse.data);
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;
        setImageURL(imageUrl);
        

      } catch (error) {
        console.error('Failed to fetch post details:', error);
      }
    };
   
    fetchPostDetail(id);

  }, [id]);

  useEffect(() => {
    if (userPost) {
      const { caption, location, tags , imageData } = userPost;
      form.setValue("caption", caption);
      form.setValue("location", location);
      form.setValue("tags", tags);    

      console.log(".....");
      console.log(userPost);
    }
  }, [userPost, form]);


  // Handler
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    console.log(value);
    console.log(value.file[0]);

    try {
     
      const formData = new FormData();
      formData.append('caption', value.caption);
      formData.append('location', value.location);
      formData.append('tags', value.tags);
      formData.append('file', value.file[0]);


      // Axios POST request to the API endpoint
      const response = await axios.put(`http://localhost:8080/users/posts/update/${idPost}`, formData);
      console.log("1111");
      console.log(response);
      if(response.data==!"Post created successfully"){
          toast({
            title :'Please try again'
          })
      }else{
        toast({
          title :'Post Updated successfully ✔'
        })

      }
      // If successful, return success message
      navigate('/');
    } catch (error:any) {
      toast({
        title :'Please try again'
      })
      //navigate('/');

      // If error occurs, throw the error
      throw error.response.data || error.message;
      
      
    }
  }

  console.log("22222")
  console.log(userPost)


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
                  // defaultValue={userPost?.caption}

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
        <Input
          type="text"
          className="shad-input"
          //fieldChange={field.onChange}
          // defaultValue={userPost?.location}
          {...field}

        />
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
          // defaultValue={userPost ? userPost.tags : ""}
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

export default UpdatePostForm;
