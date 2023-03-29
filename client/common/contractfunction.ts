import { ethers } from "ethers";
import { contractABI, contractAddress } from "../lib/constants";

interface Metadata {
  image: string;
}

export declare let window: any;

let metamask: any;

if (typeof window !== "undefined") {
  metamask = window.ethereum;
}
export const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(metamask);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};

export async function getTweetDescription(tweetId: number) {
  const contract = getEthereumContract();
  const {
    PostDescription,
    Images,
    PostId: { _hex: postid },
    LikesCount: { _hex: likesCount },
  } = await contract.getTweetInfo(tweetId);
  return { PostDescription, Images, PostId: parseInt(postid)};
}

export async function saveComment(
  PostId: number,
  walletaddres: string,
  comment: string
) {
  const contract = getEthereumContract();
  contract.saveComment(PostId, walletaddres, comment);
}
