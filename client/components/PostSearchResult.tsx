import React, { useContext, useEffect, useState } from "react";
import { TwitterContext } from "../context/TwitterContext";
import Post from "./Post";

export default function PostSearchResult({
  searchedData,
}: {
  searchedData: Array<any>;
}) {
  const { getTweetDetails } = useContext(TwitterContext);
  const [Posts, setPosts] = useState<any>();

  async function loadPostFromBlockchain() {
    let PostArray = [];
    for (const Post of searchedData) {
      PostArray.push(...(await getTweetDetails(Post.tweet)));
    }
    console.log(PostArray);
    setPosts(PostArray);
  }
  console.log(Posts);
  useEffect(() => {
    loadPostFromBlockchain();
  }, []);

  return (
    <div>
      {Posts == null
        ? null
        : Posts.map(
            ({
              author,
              tweet,
              timestamp,
              Title,
            }: {
              author: any;
              tweet: any;
              timestamp: any;
              Title: string;
            },index:number) => {
              return (
                <Post
                  displayName={
                    author.name === "Unnamed"
                      ? `${author.walletAddress.slice(
                          0,
                          4
                        )}...${author.walletAddress.slice(41)}`
                      : author.name
                  }
                  userName={author.walletAddress}
                  text={tweet}
                  avatar={author.profileImage}
                  timestamp={timestamp}
                  isProfileImageNft={author.isProfileImageNft}
                  Title={searchedData[index].Title}
                  RePost={searchedData[index].RePost}
                />
              );
            }
          )}
    </div>
  );
}
