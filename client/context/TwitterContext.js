import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { client } from '../lib/client'
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../lib/constants';
import { getTweetDescription, getEthereumContract } from '../common/contractfunction';

export const TwitterContext = createContext();
export const getNftProfileImage = (imageUri) => {

  return `https://gateway.pinata.cloud/ipfs/${imageUri}`

}
export const TwitterProvider = ({ children }) => {

  const [appStatus, setAppStatus] = useState('')
  const [currentAccount, setCurrentAccount] = useState('')
  const [currentUser, setCurrentUser] = useState({})
  const [tweets, setTweets] = useState([])
  const router = useRouter()

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  useEffect(() => {
    if (currentAccount == '' || appStatus == 'notConnected') return

    getCurrentUserDetails(currentAccount);
    fetchTweets();
  }, [currentAccount, appStatus]);


  /**
   * Checks if there is an active wallet connection
   */
  const checkIfWalletIsConnected = async () => {
    if (!window?.ethereum) return setAppStatus('noMetaMask')
    try {
      const addressArray = await window?.ethereum.request({
        method: 'eth_accounts',
      })
      if (addressArray.length > 0) {
        setAppStatus('connected')
        setCurrentAccount(addressArray[0])

        createUserAccount(addressArray[0])
      } else {
        router.push('/')
        setAppStatus('notConnected')
      }
    } catch (err) {
      router.push('/')
      setAppStatus('error')
    }
  }

  /**
   * Initiates MetaMask wallet connection
   */
  const connectWallet = async () => {
    if (!window?.ethereum) return setAppStatus('noMetaMask')
    try {
      setAppStatus('loading')

      const addressArray = await window?.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (addressArray.length > 0) {
        setCurrentAccount(addressArray[0])
        createUserAccount(addressArray[0])
      } else {
        router.push('/')
        setAppStatus('notConnected')
      }
    } catch (err) {
      setAppStatus('error')
    }
  }



  /**
   * Creates an account in Sanity DB if the user does not already have one
   * @param {String} userAddress Wallet address of the currently logged in user
   */
  const createUserAccount = async (userAddress = currentAccount) => {
    if (!window?.ethereum) return setAppStatus('noMetaMask')
    try {
      const userDoc = {
        _type: 'users',
        _id: userAddress,
        name: 'Unnamed',
        isProfileImageNft: false,
        profileImage:
          'QmZD4ZQUPocPBiF24epXEvZeHHmwLutNyJx8QZeKBUnCTH',
        walletAddress: userAddress,
        coverImage: 'QmZD4ZQUPocPBiF24epXEvZeHHmwLutNyJx8QZeKBUnCTH',
        bio: 'about you'
      }

      await client.createIfNotExists(userDoc);

      setAppStatus('connected')
    } catch (error) {
      router.push('/')
      setAppStatus('error')
    }
  }

  /**
   * Gets all the tweets stored in Sanity DB.
   */
  const fetchTweets = async () => {
    const query = `
      *[_type == "tweets"]{
        "author": author->{name, walletAddress, profileImage, isProfileImageNft},
        tweet,
        timestamp,
        Title,
        RePost
      }|order(RePost desc) | order(timestamp desc)`
    const sanityResponse = await client.fetch(query);
    let tweetsList = await getTweetFromBlockchain(sanityResponse);

    setTweets(tweetsList);
  }

  async function getTweetFromBlockchain(sanityResponse) {
    let tweetsList = [];
    for (let item of sanityResponse ?? []) {
      const profileImageUrl = item?.author?.profileImage;
      const newItem = {
        tweet: await getTweetDescription(item.tweet),
        timestamp: item.timestamp,
        author: {
          name: item?.author?.name,
          walletAddress: item?.author?.walletAddress,
          profileImage: profileImageUrl,
        },
        Title: item.Title,
        RePost: item.RePost,
      }
      if (item?.author?.isProfileImageNft) {
        newItem.author['isProfileImageNft'] = item.author.isProfileImageNft;
      }
      tweetsList.push(newItem);
    }

    return tweetsList;
  }

  /**
   * Gets the current user details from Sanity DB.
   * @param {String} userAccount Wallet address of the currently logged in user
   * @returns null
   */
  const getCurrentUserDetails = async (userAccount = currentAccount) => {
    if (appStatus !== 'connected') return
    // console.log(typeof userAccount);

    // console.log('working on getCurrentUserDetails ');
    const query = `
      *[_type == "users" && _id == "${userAccount}"]{
        "tweets": tweets[]->{timestamp, tweet ,RePost,Title}|order(timestamp desc),
        name,
        profileImage,
        isProfileImageNft,
        coverImage,
        walletAddress,
        bio
      }
    `

    // console.log(query);

    const response = await client.fetch(query)

    const profileImageUri = response[0]?.profileImage;
    // console.log(response);

    const ans = {
      tweets: await getTweetFromBlockchain(response[0]?.tweets),
      name: response[0]?.name,
      profileImage: profileImageUri,
      walletAddress: response[0]?.walletAddress,
      coverImage: response[0]?.coverImage,
      isProfileImageNft: response[0]?.isProfileImageNft,
      bio: response[0]?.bio,
    }
    // console.log(ans);
    setCurrentUser(ans);
  }

  async function getIndividualUserDetails(userAccount) {
    if (appStatus !== 'connected') return
    const query = `
      *[_type == "users" && walletAddress == "${userAccount.toLowerCase()}"]{
        "tweets": tweets[]->{timestamp, tweet,RePost,Title}|order(timestamp desc),
        name,
        profileImage,
        isProfileImageNft,
        coverImage,
        walletAddress,
        bio
      }`;

    const query2 = `
      *[_type == "users" && walletAddress == "${userAccount.toLowerCase()}"]{
        "tweets": tweets[]->{timestamp, tweet,RePost,Title}|order(timestamp desc)[0],
      }`;

    const result = await client.fetch(query2);
    console.log(result);


    const response = await client.fetch(query);
    const profileImageUri = response[0]?.profileImage;


    const ans = {
      tweets: await getTweetFromBlockchain(response[0]?.tweets),
      name: response[0]?.name,
      profileImage: profileImageUri,
      walletAddress: response[0]?.walletAddress,
      coverImage: response[0]?.coverImage,
      isProfileImageNft: response[0]?.isProfileImageNft,
      bio: response[0]?.bio,
    };
    // console.log(ans);
    return ans;
  }

  const getTweetDetails = async (PostId) => {
    if (appStatus !== 'connected') return

    const query = `
      *[_type == "tweets" &&   tweet == ${PostId}]{
        "author": author->{name, walletAddress, profileImage, isProfileImageNft},
        tweet,
        timestamp,
        Title,
        RePost
      }`;
    const response = await client.fetch(query);
    return getTweetFromBlockchain(response);
  }

  return (
    <TwitterContext.Provider
      value={{
        appStatus,
        currentAccount,
        connectWallet,
        tweets,
        fetchTweets,
        setAppStatus,
        getNftProfileImage,
        currentUser,
        getCurrentUserDetails,
        getTweetDetails,
        getIndividualUserDetails
      }}
    >
      {children}
    </TwitterContext.Provider>
  )
}
