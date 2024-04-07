import { Link } from "react-router-dom";
import PostStats from "./PostStats";




const PostCard = () => {


  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to="/profile">
            <img
              src="/assets/icons/profile-placeholder.svg"
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
youssef Mabrouk            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
7h              </p>
              •
              <p className="subtle-semibold lg:small-regular">
M'saken,Sousse              </p>
            </div>
          </div>
        </div>

        <Link
          to="/update-post">
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to="/posts">
        <div className="small-medium lg:base-medium py-5">
          <p>Je suis ravi de partager que j'ai récemment terminé une formation enrichissante en cybersécurité avec Ensit Geeks Club, sous la direction experte de Mohamed Hamdi Ouardi. Cette expérience a été une plongée profonde dans les fondements de la sécurité informatique, m'apportant des compétences précieuses pour relever les défis croissants de notre ère numérique. Un immense merci à Mohamed Hamdi Ouardi et à toute l'équipe d'Ensit Geeks Club pour cette opportunité stimulante et instructive ! 🛡️💻🎓 </p>
          <ul className="flex gap-1 mt-2">
            <li className="text-light-3 small-regular">#cyber </li>
            <li className="text-light-3 small-regular">#security </li>
            <li className="text-light-3 small-regular">#pfa </li>
            <li className="text-light-3 small-regular">#hacker </li>

          </ul>
        </div>

        <img
          src= "/assets/images/sec.jpg"
          alt="post image"
          className="post-card_img"
        />
      </Link>
      <PostStats  />


    </div>
  );
};

export default PostCard;
