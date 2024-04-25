import * as React from "react";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import axios from "axios";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "../ui/use-toast";
import { multiFormatDateString } from "@/lib/utils";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface DrawersProps {
  vote: Vote;
}

interface Vote {
  id: number;
  question: string;
  description: string;
  yesCount: number;
  noCount: number;
  decision: boolean;
  date: string;
  usersVotedYes: any[];
  usersVotedNo: any[];
}

export default function Drawers({ vote }: DrawersProps) {
  const [desition, setDesition] = React.useState(false);
  const [uvote, setUvote] = React.useState(false);
  const { user ,fetch, setFetch} = useUserContext();

  const data = [
    { goal: vote.yesCount },
    { goal: vote.noCount },
  ];

  function hasUserVoted(response, userId) {
    const usersVotedYesIds = response.usersVotedYes.map(user => user.id);
    const usersVotedNoIds = response.usersVotedNo.map(user => user.id);
  
    return usersVotedYesIds.includes(userId) || usersVotedNoIds.includes(userId);
  }
  
  React.useEffect(() => {
    setUvote(hasUserVoted(vote, user.id));
  }, [vote, user.id]);
  
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("vote", desition ? "yes" : "no");
  
      const response = await axios.post(
        `http://localhost:8080/users/api/votes/${vote.id}/vote`,
        formData
      );
  
      if (response.status === 200) {
        toast({
          title: "Vote submitted successfully ✔",
        });
        setFetch(!fetch);
      } else {
        toast({
          title: "Failed to submit vote",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to submit vote",
      });
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
       const response = await axios.delete(
        `http://localhost:8080/users/api/votes/${vote.id}`
      );
  
      if (response.status === 200) {
        toast({
          title: "delete successfully ✔",
        });
        setFetch(!fetch);
      } else {
        toast({
          title: "Failed to delete vote",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to delete vote",
      });
      console.error(error);
    }
  };

  function onClick() {
    setDesition((prev) => !prev);
  }

  return (
    <Drawer >
      <DrawerTrigger asChild>
        <Button variant="outline" className="vote-tab h-14 w-5 inline-block ">
    {vote.question}
  </Button>


      </DrawerTrigger>
      <DrawerContent className="bg-white text-black" >
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
          <DrawerTrigger>{multiFormatDateString(vote.date)}</DrawerTrigger>

            <DrawerTitle>{vote.question}</DrawerTitle>
            <DrawerDescription>{vote.description}</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={onClick}
                disabled={uvote}
              >
                <MinusIcon className="h-4 w-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {desition ? "Yes" : "No"}
                </div>
                
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={onClick}
                disabled={uvote}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart  data={data}>
                  <Bar 
                    dataKey="goal"
                    style={{ fill: "hsl(var(--foreground))", opacity: 0.9 , backgroundColor:'white'}}
                  />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center">
              <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="pr-20 mr-10 d-flex justify-content-center align-items-center">Yes</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>List Student Voted Yes</SheetTitle>
          
        </SheetHeader>
        <><ul >
            {vote.usersVotedYes.map((v) => (
              <li className=' pt-8'>
              {v.firstname}  {v.lastname}
              </li>
            ))}</ul>
          </>
        <SheetFooter>
          
        </SheetFooter>
      </SheetContent>
    </Sheet>
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="pr-20 pl-9">No</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>List Student Voted No</SheetTitle>
          
        </SheetHeader>
        <><ul >
            {vote.usersVotedNo.map((v) => (
              <li className=' pt-8'>
              {v.firstname}  {v.lastname}
              </li>
            ))}</ul>
          </>
        <SheetFooter>
          
        </SheetFooter>
      </SheetContent>
    </Sheet>
                {/* <h3 className="text-black  pr-20">Yes</h3>
                <h3 className="text-black pl-16">No</h3> */}
              </div>
              
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSubmit} className="bg-black text-white mt-6">Submit</Button>
            <Button onClick={handleDelete} className={`ost_details-delete_btn bg-red ${user.role === "DELEGUE" ? "" : "hidden"}`}>delete</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
              

            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
