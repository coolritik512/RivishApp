import { ethers } from "ethers";
import { useEffect, useContext, useState } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import { contractABI, contractAddress } from "../../lib/constants";
import { Tweet, TweetAuthor } from "../home/Feed";
import Post from "../Post";
import PostsContainer from "../PostsContainer";

declare let window: any;

const style = {
  wrapper: ` no-scrollbar`,
  header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
};

interface Tweets extends Array<Tweet> {}

const ProfileTweets = () => {
  let params;
  let searchedUser:any=null;

  if (window) {
     params = new URLSearchParams(window?.location?.search);
     searchedUser = params.get("userName");
  }
  
  console.log("profile tweet");

  const { currentUser, getIndividualUserDetails } = useContext(TwitterContext);

  const [tweets, setTweets] = useState<Tweets>([]);
  // console.log(tweets);
  const [author, setAuthor] = useState<TweetAuthor>({
    name: "",
    profileImage: "",
    walletAddress: "",
    isProfileImageNft: undefined,
  });

  async function getUserDetails(UserAddress: string) {
    setTweetAndAuthor(await getIndividualUserDetails(UserAddress));
  }

  useEffect(() => {
    if (searchedUser != null) {
      getUserDetails(searchedUser);
    }
    if (searchedUser == null) {
      setTweetAndAuthor(currentUser);
    }
  }, [searchedUser]);

  function setTweetAndAuthor(currentUser: any) {
    setTweets(currentUser.tweets);
    setAuthor({
      name: currentUser.name,
      profileImage: currentUser.profileImage,
      walletAddress: currentUser.walletAddress,
      isProfileImageNft: currentUser.isProfileImageNft,
    });
  }

  return (
    <div className={style.wrapper + "overflow-scroll"}>
      <PostsContainer author={author} tweets={tweets} />
    </div>
  );
};

export default ProfileTweets;
