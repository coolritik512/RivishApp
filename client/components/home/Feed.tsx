import { useContext, useEffect, useState } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import TweetBox from "./TweetBox";
import { BsStars } from "react-icons/bs";
import PostsContainer from "../PostsContainer";
import { getEthereumContract } from "../../common/contractfunction";
import { client } from "../../lib/client";

const style = {
  wrapper: `flex-[2] border-r border-l border-[#38444d] overflow-y-scroll relative no-scrollbar`,
  header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
};

export interface Tweet {
  author?: TweetAuthor;
  tweet: {
    PostDescription: string;
    Images: [string];
  };
  timestamp: string;
  RePost?: number;
  Title?: string;
}

export interface TweetAuthor {
  name: string;
  walletAddress: string;
  profileImage: string;
  isProfileImageNft: boolean | undefined;
}

function Feed() {
  const { tweets, currentUser, getTweetDetails } = useContext(TwitterContext);

  const [Posts, setPosts] = useState<any>();

  async function getRecentPostofUser(userAddress: string) {
    console.log("getRecent post if user");
    const query = `
    *[_type == "users" && walletAddress == "${userAddress.toLowerCase()}"]{
      "tweets": tweets[]->{tweet}|order(timestamp desc),
    }`;

    console.log(query);

    const result = await client.fetch(query);
    console.log(result);
    let TweetDes = [];
    if (result[0]?.tweets?.length > 0) {
      TweetDes = await getTweetDetails(result[0].tweets[0].tweet);
    }

    console.log(TweetDes);
    return TweetDes.length > 0 ? TweetDes[0] : null;
  }

  async function getFollowedUserPost() {
    console.log("getFollowe Use post");

    const contract = getEthereumContract();
    const followedUser = await contract.getFollowingDetails(
      currentUser.walletAddress
    );
    const Tweets = [];
    console.log(followedUser);
    for (const useraddres of followedUser) {
      const recentPost = await getRecentPostofUser(useraddres);
      if (recentPost) Tweets.push(recentPost);
    }
    let newPost = [...tweets, ...Tweets];
    setPosts(newPost);
  }

  useEffect(() => {
    console.log("useEffect at feed");
    if (currentUser?.walletAddress) getFollowedUserPost();
  }, [currentUser?.walletAddress, tweets]);

  return (
    <div className={`${style.wrapper} no-scrollbar`}>
      <div className={style.header}>
        <div className={style.headerTitle}>Home</div>
        <BsStars />
      </div>
      <TweetBox />
      <PostsContainer tweets={Posts} />
    </div>
  );
}

export default Feed;
