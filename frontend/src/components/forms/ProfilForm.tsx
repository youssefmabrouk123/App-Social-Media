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
import { ProfilValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUploader from "../shared/FileUploader";
import axios from "axios";
import { useState } from "react";

type ProfilFormProps = {
  profil?: Models.Document;
  action: "Create" | "Update";
};

const ProfilForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const formDefaultValues = {
    firstname: user ? user.firstname : "",
    lastname: user ? user.lastname : "",
    bio: user ? user.bio : "",
    filiere: user ? user.filiere : "",
    file: [],
  };

  const form = useForm<z.infer<typeof ProfilValidation>>({
    resolver: zodResolver(ProfilValidation),
    defaultValues: formDefaultValues,
  });

  // Handler
  const handleSubmit = async (value: z.infer<typeof ProfilValidation>) => {
    console.log(value);
    try {
      const formData = new FormData();
      formData.append('userid', user.id);
      formData.append('firstname', value.firstname);
      formData.append('lastname', value.lastname);
      formData.append('bio', value.bio);
      formData.append('filiere', value.filiere);
      formData.append('file', value.file[0]);

      const response = await axios.post('http://localhost:8080/users/update', formData);

      if (response.data === "Profil Updated successfully") {
        toast({
          title: 'Profil Updated successfully ✔'
        });
      } else {
        toast({
          title: 'Please try again'
        });
      }
      navigate('/');
    } catch (error:any) {
      toast({
        title: 'Please try again'
      });
      throw error.response.data || error.message;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl">
        {/* Render file uploader */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={user?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        {/* Render firstname field */}
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Firstname</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        {/* Render lastname field */}
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Lastname</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        
        {/* Render bio field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Bio</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        {/* Render filiere field */}
        <FormField
          control={form.control}
          name="filiere"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Filiere</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
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
          >
            Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfilForm;
