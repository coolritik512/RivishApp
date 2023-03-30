import { useState, useContext, InputHTMLAttributes } from "react";
import { TwitterContext } from "../../context/TwitterContext";
import { BsCardImage, BsEmojiSmile } from "react-icons/bs";
import { client } from "../../lib/client";
import { pinFileToIPFS, pinJSONToIPFS } from "../../lib/pinata";
import { contractABI, contractAddress } from "../../lib/constants";
import { ethers } from "ethers";
import { fileURLToPath } from "url";
import { getEthereumContract } from "../../common/contractfunction";
import { uploadImagesToPintata } from "../../common/pintatafunction";

const style = {
  wrapper: `px-4 flex flex-row border-b border-[#38444d] pb-4`,
  tweetBoxLeft: `mr-4`,
  tweetBoxRight: `flex-1`,
  profileImage: `height-12 w-12 rounded-full`,
  inputField: `w-full h-full outline-none bg-transparent text-lg`,
  formLowerContainer: `flex`,
  iconsContainer: `text-[#1d9bf0] flex flex-1 items-center`,
  icon: `mr-2`,
  submitGeneral: `px-6 py-2 rounded-3xl font-bold`,
  inactiveSubmit: `bg-[#196195] text-[#95999e]`,
  activeSubmit: `bg-[#1d9bf0] text-white`,
};

function TweetBox() {
  const [Title, setTitle] = useState("");
  const [tweetMessage, setTweetMessage] = useState("");
  const { currentAccount, fetchTweets, currentUser } =
    useContext(TwitterContext);
  const [PostImage, setPostImage] = useState<File[] | null>();

  function saveSelectedFiles(event: React.ChangeEvent<HTMLInputElement>) {
    if (event?.target?.files?.length) {
      const temp = [];
      for (var i = 0; i < event?.target?.files?.length; i++) {
        temp.push(event?.target?.files[i]);
      }
      setPostImage(temp);
    }
  }

  async function saveToBlockchainAndGetId(
    PostMessage: string,
    ImagesCode: any
  ) {
    const contract = getEthereumContract();

    await contract.saveTweet(
      currentUser.walletAddress,
      PostMessage,
      ImagesCode
    );
    return parseInt(await contract.PostId());
  }

  const submitTweet = async (event: any) => {
    event.preventDefault();

    if (!tweetMessage) return;

    const ImageCodes = await uploadImagesToPintata(PostImage);

    const tweetIdOnBlockchain = await saveToBlockchainAndGetId(
      tweetMessage,
      ImageCodes
    );

    const tweetIdString = "id" + tweetIdOnBlockchain;

    const tweetDoc = {
      _id: tweetIdString,
      _type: "tweets",
      tweet: tweetIdOnBlockchain,
      timestamp: new Date(Date.now()).toISOString(),
      author: {
        _key: tweetIdString,
        _ref: currentAccount,
        _type: "reference",
      },
      Title: Title.slice(1),
    };

    await client.createIfNotExists(tweetDoc);

    await client
      .patch(currentAccount)
      .setIfMissing({ tweets: [] })
      .insert("after", "tweets[-1]", [
        {
          _key: tweetIdString,
          _ref: tweetIdString,
          _type: "reference",
        },
      ])
      .commit();
    setTweetMessage("");
    await fetchTweets();
  };

  const selectImage = () => {
    document.getElementById("ImageSelectorForUpload")?.click();
  };

  return (
    <div className={style.wrapper}>
      <div className={style.tweetBoxLeft}>
        <img
          src={"https://gateway.pinata.cloud/ipfs/" + currentUser.profileImage}
          className={
            currentUser.isProfileImageNft
              ? `${style.profileImage} smallHex`
              : style.profileImage
          }
        />
      </div>

      <div className={style.tweetBoxRight}>
        <form>
          <input
            id="Title"
            onChange={(e) => setTitle(e.target.value)}
            className="px-2 bg-transparent border-b outline-none  border-gray-500 w-full"
            placeholder="#something"
          ></input>
          <textarea
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="What's happening?"
            rows={5}
            className={`${style.inputField} border mt-2 border-gray-400 rounded-lg resize-none no-scrollbar`}
          />
          <div className={style.formLowerContainer}>
            <div className={style.iconsContainer}>
              <input
                type="file"
                name="ImageSelectorForUpload"
                id="ImageSelectorForUpload"
                className="hidden"
                multiple
                accept=".jpg, .jpeg, .png"
                onChange={(e) => saveSelectedFiles(e)}
              />
              <BsCardImage
                className={style.icon}
                onClick={selectImage}
              ></BsCardImage>
            </div>

            <button
              type="submit"
              onClick={(event) => submitTweet(event)}
              disabled={!tweetMessage}
              className={`${style.submitGeneral} ${
                tweetMessage ? style.activeSubmit : style.inactiveSubmit
              }`}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TweetBox;
