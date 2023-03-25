import { ethers } from 'ethers'
import { useEffect, useContext, useState } from 'react'
import { TwitterContext } from '../../context/TwitterContext'
import { contractABI, contractAddress } from '../../lib/constants'
import Post from '../Post'

interface Metadata {
  image: string;
}
declare let window: any;

let metamask: any;

if (typeof window !== "undefined") {
  metamask = window.ethereum;
}

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(metamask);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

const style = {
  wrapper: ` no-scrollbar`,
  header: `sticky top-0 bg-[#15202b] z-10 p-4 flex justify-between items-center`,
  headerTitle: `text-xl font-bold`,
}

interface Tweet {
  timestamp: string
  tweet: string
}

interface Tweets extends Array<Tweet> {}

interface Author {
  name: string
  profileImage: string
  walletAddress: string
  isProfileImageNft: Boolean | undefined
}

const ProfileTweets = () => {
  
  console.log('profile tweet');
  const params = new URLSearchParams(window.location.search);
  const searchedUser = params.get("userName");

  const { currentUser,getIndividualUserDetails } = useContext(TwitterContext);

  const [tweets, setTweets] = useState<Tweets>([
    {
      timestamp: '',
      tweet: '',
    },
  ])
  const [author, setAuthor] = useState<Author>({
    name: '',
    profileImage: '',
    walletAddress: '',
    isProfileImageNft: undefined,
  })

  async function getUserDetails(UserAddress:string){
     setTweetAndAuthor(await getIndividualUserDetails(UserAddress));
  }

  useEffect(()=>{
    if (searchedUser !=null) {
      getUserDetails(searchedUser);
    }
    if(searchedUser==null){
      setTweetAndAuthor(currentUser);
    }
  },[searchedUser]);


  function setTweetAndAuthor(currentUser:any){
    setTweets(currentUser.tweets)
    setAuthor({
      name: currentUser.name,
      profileImage: currentUser.profileImage,
      walletAddress: currentUser.walletAddress,
      isProfileImageNft: currentUser.isProfileImageNft,
    });
  }
  
  return (
    <div className={style.wrapper + 'overflow-scroll'}>
      {tweets?.map((tweet: Tweet, index: number) => (
        <Post
          key={index}
          displayName={
            author.name === 'Unnamed'
              ? `${author.walletAddress.slice(
                  0,
                  4,
                )}...${author.walletAddress.slice(41)}`
              : author.name
          }
          userName={author.walletAddress}
          text={tweet.tweet}
          avatar={author.profileImage}
          timestamp={tweet.timestamp}
          isProfileImageNft={author.isProfileImageNft}
          Title={tweet.Title}
        />
      ))}
    </div>
  )
}

export default ProfileTweets
