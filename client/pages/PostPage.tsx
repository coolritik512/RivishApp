import { useContext, useEffect, useState } from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { getEthereumContract } from "../common/contractfunction";
import CommentComponent from "../components/commentComponent";
import { Tweet } from "../components/home/Feed";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { TwitterContext } from "../context/TwitterContext";
import { window } from "../lib/constants";

const style = {
  wrapper: `flex justify-center h-screen w-screen select-none bg-[#15202b] text-white`,
  content: `w-full flex justify-between`,
  mainContent: `flex-[2] border-r border-l border-[#38444d] overflow-y-scroll no-scrollbar`,
};
// declare let window: any;

const PostPage = () => {
  // let window: any;
  const params = new URLSearchParams(window.location.search);
  const PostId = parseInt(params.get("PostId") ?? "");
  console.log("ukku ", PostId);

  const { getTweetDetails } = useContext(TwitterContext);

  const [PostInfo, setPostInfo] = useState({});
  const [tweets, setTweet] = useState([]);

  async function getPostDetails(PostId: number) {
    setTweet(await getTweetDetails(PostId));
  }

  useEffect(() => {
    if (typeof PostId == "number") {
      getPostDetails(PostId);
    }
  }, []);

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <Sidebar initialSelectedIcon={""} />
        <div className={style.mainContent}>
          {tweets.map((tweet: any, index: number) => (
            <div>
              {" "}
              <Post
                key={index}
                displayName={
                  tweet.author.name === "Unnamed"
                    ? `${tweet.author.walletAddress.slice(
                        0,
                        4
                      )}...${tweet.author.walletAddress.slice(41)}`
                    : tweet.author.name
                }
                userName={`${tweet.author.walletAddress}`}
                text={tweet.tweet}
                avatar={tweet.author.profileImage}
                isProfileImageNft={tweet.author.isProfileImageNft}
                timestamp={tweet.timestamp}
                Title={tweet.Title}
                RePost={tweet.RePost}
              />
              <CommentComponent PostId={tweet.tweet.PostId} />
            </div>
          ))}
        </div>
        <Widgets />
      </div>
    </div>
  );
};

export default PostPage;

    



