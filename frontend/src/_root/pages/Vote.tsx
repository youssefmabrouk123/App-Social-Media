import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '@/components/shared/Loader';
import Drawers from '@/components/shared/Drawers';
import { useUserContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Vote {
  id: number;
  question: string;
  description: string;
  yesCount: number;
  noCount: number;
  decision: boolean;
  date: string;
  usersVotedYes: any[]; // Change this according to your user type
  usersVotedNo: any[]; // Change this according to your user type
}

const Vote: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [votes, setVotes] = useState<Vote[]>([]);
  const { user,fetch } = useUserContext();
  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<any>("http://localhost:8080/users/api/votes");
        setVotes(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetch]);


 
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="saved-container"> 
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/share.svg  "
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Votes</h2>
      </div>
      <div className="flex gap-2 w-full max-w-5xl">
        <Button
          className={`${user.role === "DELEGUE" ? "shad-button_primary whitespace-nowrap" : "hidden"}`}
          type="submit"
          onClick={() => navigate('/create-vote')} >
          Create a Vote 
        </Button>


      </div>
      <div style={{ margin: '20px auto', padding: '40px' }}>
        {votes.length > 0 ? (
          <><ul >
            {votes.map((vote) => (
              <li className=' pt-8'>
              <Drawers key={vote.id} vote={vote} />
              </li>
            ))}</ul>
          </>
        ) : (
          <p>No Votes found</p>
        )}
      </div>
    </div>
  );
};

export default Vote;
