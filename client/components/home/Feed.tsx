import { useContext, useEffect } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import TweetBox from "./TweetBox";
import Post from "../Post";
import { BsStars } from "react-icons/bs";
import PostsContainer from "../PostsContainer";

const style = {
  wrapper: `flex-[2] border-r border-l border-[#38444d] overflow-y-scroll relative no-scrollbar`,
  header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
};

export interface Tweet {
  author?: TweetAuthor;
  tweet: {
    PostDescription:string,
    Images: [string],
  }
  timestamp: string;
  RePost?:number
  Title?:string;
}

export interface TweetAuthor {
  name: string;
  walletAddress: string;
  profileImage: string;
  isProfileImageNft: boolean|undefined;
}

function Feed() {
  
  const { tweets,currentUser } = useContext(TwitterContext);

  return (
    <div className={`${style.wrapper} no-scrollbar`}>
      <div className={style.header}>
        <div className={style.headerTitle}>Home</div>
        <BsStars />
      </div>
      <TweetBox />
      <PostsContainer tweets={tweets}/>
    </div>
  );
}

export default Feed;
