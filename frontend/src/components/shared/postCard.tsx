import { Link } from "react-router-dom";
import PostStats from "./PostStats";

interface PostCardProps {
  creatorFirstname: string;
  creatorLastname: string;
  postCaption: string;
  postLocation: string;
  postDate: string;
  postImage: string;
  // Add more props as needed
}

const PostCard: React.FC<PostCardProps> = ({
  creatorFirstname,
  creatorLastname,
  postCaption,
  postLocation,
  postDate,
  postImage,
  // Add more props as needed
}) => {
  return (
    <div className="post-card" style={{ marginBottom: '30px' }}>
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
              {creatorFirstname} {creatorLastname}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {postDate}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {postLocation}
              </p>
            </div>
          </div>
        </div>

        <Link to="/update-post">
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
          <p>{postCaption}</p>
          {/* Tags or other content */}
        </div>

        <img
          src={postImage}
          alt="post image"
          className="post-card_img"
        />
      </Link>
      <PostStats />
    </div>
  );
};

export default PostCard;
