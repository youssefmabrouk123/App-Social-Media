import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableFooter, TableCell, TableHead, TableHeader, TableRow, } from "@/components/shared/Table"


interface Event {
  eventId: number;
  userId: number;
  firstname: string;
  lastname: string;
  eventName: string;
  eventDescription: string;
  eventDate: string;
  creationdate: string;
  location: string;
  organizer: string;
  image: string;
  imageData: string;
  imageProfilData: string;
}

const arrayBufferToBasee64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const EventDetails = () => {
  const { user } = useUserContext();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<Event | undefined>();
  const [imageURL, setImageURL] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [participated, setParticipated] = useState<boolean>(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async (id: any) => {
      setIsLoading(true);
      try {
        const eventResponse = await axios.get<Event>(
          `http://localhost:8080/users/events/${id}`
        );
       
        
        setEvent(eventResponse.data);
        console.log("eventResponse.data :");
        console.log(eventResponse.data);
        ///////////////

        const imageProfilResponse = await axios.get(`http://localhost:8080/users/events/${eventResponse.data.eventId}/img`, {
          responseType: 'arraybuffer'
        });
        const base64Img = arrayBufferToBasee64(imageProfilResponse.data);
        const imagee = `data:image/jpeg;base64,${base64Img}`;
        setImageURL(imagee);

        //////////////
        const imageResponse = await axios.get(`http://localhost:8080/users/events/${eventResponse.data.eventId}/imgprofil`, {
          responseType: 'arraybuffer'
        });
        console.log("imageResponsedata" , imageResponse.data)
        const base64Imagee = arrayBufferToBasee64(imageResponse.data);
        const img = `data:image/jpeg;base64,${base64Imagee}`;
        setProfileImage(img);
        //console.log(imagee);

        // Check if the user has participated in the event
        const participationResponse = await axios.get(
          `http://localhost:8080/users/participation/check/${eventResponse.data.eventId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setParticipated(participationResponse.data === "Participated");

        // console.log("participation:")
        // console.log(participated)
        // console.log("eventResponse.data.eventId:")
        // console.log(eventResponse.data.eventId)


        setIsLoading(false);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData(id);
  }, [id]);

  /////
  console.log("event :");
  console.log(event);

  //////
  const handleParticipation = async (eventId: any | undefined) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!event || !token) return;

      if (!participated) {
        // Add participation
        await axios.post(
          `http://localhost:8080/users/participation/add/${eventId}`,
          null, // No request body needed for POST request
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setParticipated(true);
        console.log("participation:")
        console.log(participated)
        toast({
          title: "Participation added ✔ ",
        });
      } else {
        // Delete participation
        await axios.delete(
          `http://localhost:8080/users/participation/delete/${event.eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setParticipated(false);
        console.log("participation:")
        console.log(participated)
        toast({
          title: "Participation deleted ✔ ",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to update participation",
      });
      console.error("Failed to update participation:", error);
    }
  };

  ////

  const handleDelete = async (eventId: number | undefined) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!eventId || !token) return;

      const response = await axios.delete(
        `http://localhost:8080/users/events/del/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Event deleted ✔ ",
      });
      navigate("/events");
      console.log("Event deleted successfully:", response.data);
    } catch (error) {
      toast({
        title: "Failed to delete event",
      });
      console.error("Failed to delete event:", error);
    }
  };

  ///////

  const fetchParticipants = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/users/participation/all/${event?.eventId}`);
      const participantsData = response.data;
      const participantsInfo = participantsData.map((participant: any) => ({
        firstname: participant.user.firstname,
        lastname: participant.user.lastname,
        email: participant.user.email
      }));
      setParticipants(participantsInfo);
      setTotalParticipants(participantsData.length);

    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  /////
  if (isLoading) {
    return <p>Loading event details...</p>;
  }

  return (
    <div className="post_details-container">
      <h3 className="h3-bold md:h2-bold text-left w-full">EVENT DETAILS</h3>

      <div className="post_details-card">
        <img src={imageURL} alt="event" className="post_details-img" />
        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link to="/profile" className="flex items-center gap-3">
              <img
                src={
                  profileImage ||
                  "/assets/icons/profile-placeholder.svg"
                }
                className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
              />
              <div className="flex gap-1 flex-col">
                <p className="base-medium lg:body-bold text-light-1">
                  {event?.firstname} {event?.lastname}
                </p>
                <div className="flex-center gap-2 text-light-3">
                  <p className="subtle-semibold lg:small-regular ">
                    {multiFormatDateString(event?.creationdate)}
                  </p>
                </div>
              </div>
            </Link>

            <div className="flex-center gap-4 ">
              {/* <Button
                onClick={() => handleDelete(event?.eventId)}
                className={`${parseInt(user.id, 10) === event?.userId ? "" : "hidden"
                  }`}>
                <img
                  src={"/assets/icons/group.svg"}
                  alt="delete"
                  width={24}
                  height={24}
                />
              </Button> */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button onClick={fetchParticipants} className={`${user.role === "CLUB" ? "" : "hidden"}`} >
                    <img
                      src={"/assets/icons/group.svg"}
                      alt="Participants"
                      width={25}
                      height={24}
                    />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>List of participants</AlertDialogTitle>
                    <AlertDialogDescription>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Firstname</TableHead>
                            <TableHead>Lastname</TableHead>
                            <TableHead>Email</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {participants.map((participant, index) => (
                            <TableRow key={index}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{participant.firstname}</TableCell>
                              <TableCell>{participant.lastname}</TableCell>
                              <TableCell>{participant.email}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={3}>Total participants :</TableCell>
                            <TableCell className="text-right">{totalParticipants}</TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                onClick={() => handleDelete(event?.eventId)}
                className={`${parseInt(user.id, 10) === event?.userId ? "" : "hidden"
                  }`}>
                <img
                  src={"/assets/icons/delete.svg"}
                  alt="delete"
                  width={24}
                  height={24}
                />
              </Button>
              <Link
                to={`/update-event/${event?.eventId}`}
                className={`${parseInt(user.id, 10) === event?.userId ? "" : "hidden"
                  }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={24}
                  height={24}
                />
              </Link>
            </div>
          </div>

          <hr className="border w-full border-dark-5/80" />
          <div className="flex flex-col w-full small-medium lg:base-regular">
            <h1><b><i>•Name : </i></b> {event?.eventName || "undefined" }  </h1>
          </div>
          <div className="flex flex-col w-full small-medium lg:base-regular">
            <p><b><i>•Date : </i></b> {event?.eventDate || "undefined" } </p>
          </div>
          <div className="flex flex-col w-full small-medium lg:base-regular">
            <p><b><i>•Location : </i></b> {event?.location || "undefined" }</p>
          </div>
          <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p><b><i>•Note : </i></b>{event?.eventDescription || "undefined" }</p>
          </div>

          <hr className="border w-full border-dark-5/70" />

          <div style={{ marginLeft: "auto", marginRight: "auto", marginBottom: "3%", display: 'grid', placeItems: 'center' }}>
            <Button
              style={{
                backgroundColor: participated ? "gray" : "blue",
                color: "white",
              }}
              className={`${user.role !== "CLUB" ? "shad-button_primary whitespace-nowrap" : "hidden"}`}
              type="submit"
              onClick={() => handleParticipation(event?.eventId)} >
              {participated ? "Cancel participation" : "Participate"}
            </Button>
          </div>

        </div>
      </div>

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />
      </div>
    </div>
  );
};

export default EventDetails;
