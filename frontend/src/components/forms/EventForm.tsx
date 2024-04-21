import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { EventValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import FileUploader from "../shared/FileUploader";
import axios from "axios";

type EventFormProps = {
    event?: Models.Document;
};

const EventForm = ({ event }: EventFormProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useUserContext();
    const form = useForm<z.infer<typeof EventValidation>>({
        resolver: zodResolver(EventValidation),
        defaultValues: {
            eventName: event ? event?.eventName : "",
            eventDescription: event ? event?.eventDescription : "",
            location: event ? event?.location : "",
            organizer: event ? event?.organizer : "",
            eventDate: event ? event?.eventDate : "",
            file: [],
        },
    });

    const handleSubmit = async (value: z.infer<typeof EventValidation>) => {
        try {
            const formData = new FormData();
            formData.append("userid", user.id);
            formData.append("eventName", value.eventName);
            formData.append("eventDescription", value.eventDescription);
            formData.append("location", value.location);
            formData.append("organizer", value.organizer);
            formData.append("eventDate", value.eventDate);
            formData.append("file", value.file[0]);

            console.log(value.file[0]);

            const token = localStorage.getItem("accessToken");
            const response = await axios.post(
                "http://localhost:8080/users/events/create",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log(response);
            if (response.data === "Event created successfully") {
                toast({
                    title: "Event created successfully ✔",
                });
                navigate("/events");
            } else {
                toast({
                    title: "Please try again",
                });
            }
        } catch (error: any) {
            console.error("Error submitting event form:", error);
            toast({
                title: "Please try again",
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-9 w-full max-w-5xl">

                <FormField
                    control={form.control}
                    name="eventName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Name :</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="eventDescription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Description :</FormLabel>
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
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Location :</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="organizer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Organizer :</FormLabel>
                            <FormControl>
                                <Input type="text" className="shad-input" {...field} />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="shad-form_label">Event date :</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    className="shad-input"
                                    {...field}
                                    placeholder="YYYY-MM-DD HH:MIN"
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
                            <FormLabel className="shad-form_label">Add Picture :</FormLabel>
                            <FormControl>
                                <FileUploader
                                    fieldChange={field.onChange}
                                    mediaUrl={event?.imageUrl}
                                />
                            </FormControl>
                            <FormMessage className="shad-form_message" />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4 items-center justify-end">
                    <Button type="button" className="shad-button_dark_4" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                    <Button type="submit" className="shad-button_primary whitespace-nowrap">
                        Add Event
                    </Button>
                </div>
            </form>
        </Form>

    );
};

export default EventForm;
