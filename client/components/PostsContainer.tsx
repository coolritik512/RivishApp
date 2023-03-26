import React from "react";
import { Tweet, TweetAuthor } from "./home/Feed";
import Post from "./Post";

export default function PostsContainer({
  author,
  tweets,
}: {
  author?: TweetAuthor;
  tweets: Array<Tweet>;
}) {
  function setAuthor(tweet: Tweet) {
    if (author) tweet["author"] = author;
  }
  return (
    <div>
      {tweets.map((tweet: Tweet, index: number) => {
        setAuthor(tweet);
        return <Post
          key={index}
          displayName={
            tweet?.author?.name === "Unnamed"
              ? `${tweet.author.walletAddress.slice(
                  0,
                  4
                )}...${tweet.author.walletAddress.slice(41)}`
              : tweet?.author?.name
          }
          userName={tweet?.author?.walletAddress}
          text={tweet.tweet}
          avatar={tweet.author?.profileImage}
          isProfileImageNft={tweet.author?.isProfileImageNft}
          timestamp={tweet.timestamp}
          Title={tweet.Title}
          RePost={tweet.RePost}
        />;
      })}
    </div>
  );
}
