import { useContext, useEffect, useState } from "react";
import { getNftProfileImage, TwitterContext } from "../../context/TwitterContext";
import { BsArrowLeftShort } from "react-icons/bs";
import { useRouter } from "next/router";
import Modal from "react-modal";
import ProfileImageMinter from "./mintingModal/ProfileImageMinter";
import { customStyles } from "../../lib/constants";
import { FaRegEdit } from "react-icons/fa";

Modal.setAppElement("#__next");

const style = {
  wrapper: `border-[#38444d] border-b`,
  header: `py-1 px-3 mt-2 flex items-center`,
  primary: `bg-transparent outline-none font-bold`,
  secondary: `text-[#8899a6] text-xs`,
  backButton: `text-3xl cursor-pointer mr-2 rounded-full hover:bg-[#313b44] p-1`,
  coverPhotoContainer: `flex items-center justify-center h-[30vh] overflow-hidden`,
  coverPhoto: `object-cover h-full w-full`,
  profileImageContainer: `w-full h-[8rem] rounded-full mt-[-3rem] mb-2 flex justify-start items-center px-3 flex justify-between`,
  profileImage: `object-cover rounded-full h-full`,
  profileImageNft: `object-cover h-full`,
  profileImageMint: `bg-white text-black px-3 py-1 rounded-full hover:bg-[#8899a6] cursor-pointer`,
  details: `px-3`,
  nav: `flex justify-around mt-4 mb-2 text-xs font-semibold text-[#8899a6]`,
  activeNav: `text-white`,
  editProfile: `flex items-center min-w-fit text-right gap-1 rounded-xl p-2 mt-4  text-base font-bold border border-zinc-400`,
};

interface Tweets {
  tweet: string;
  timestamp: string;
}

interface UserData {
  name: string;
  profileImage: string;
  coverImage: string;
  walletAddress: string;
  tweets: Array<Tweets>;
  isProfileImageNft: Boolean | undefined;
  bio:string
}

declare let window: any;

const ProfileHeader = () => {

  console.log('profile header');
  const params = new URLSearchParams(window.location.search);
  const UserAddress = params.get("userName") ?? "";
  const [userData, setUserData] = useState<UserData>({
    name: "",
    profileImage: "",
    coverImage: "",
    walletAddress: "",
    tweets: [],
    isProfileImageNft: undefined,
    bio:''
  });

  let { currentAccount, currentUser, getIndividualUserDetails } =
    useContext(TwitterContext);

  async function getUserDetails(UserAddress: string) {
    //  await getIndividualUserDetails(UserAddress);
    initailiseUserData(await getIndividualUserDetails(UserAddress));
  }

  // use effect for opening another person profile;
  useEffect(() => {
    if (UserAddress != "") {
      getUserDetails(UserAddress);
    }
  },[]);

  function initailiseUserData(currentUser: any) {
    setUserData({
      name: currentUser.name,
      profileImage: currentUser.profileImage,
      walletAddress: currentUser.walletAddress,
      coverImage: currentUser.coverImage,
      tweets: currentUser.tweets,
      isProfileImageNft: currentUser.isProfileImageNft,
      bio:currentUser.bio
    });
  }

  const router = useRouter();

  useEffect(() => {
    if (!currentUser || UserAddress != "") return;

    initailiseUserData(currentUser);
  }, [currentUser]);

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        <div onClick={() => router.push("/")} className={style.backButton}>
          <BsArrowLeftShort />
        </div>
        <div className={style.details}>
          <div className={style.primary}>{userData.name}</div>
          <div className={style.secondary}>
            {userData.tweets?.length} Tweets
          </div>
        </div>
      </div>
      <div className={style.coverPhotoContainer}>
        <img
          src={getNftProfileImage(userData.coverImage)}
          alt="cover"
          className={style.coverPhoto}
        />
      </div>
      <div className={style.profileImageContainer}>
        <div
          className={
            currentUser.isProfileImageNft ? "hex" : style.profileImageContainer
          }
        >
          <img
            src={getNftProfileImage(userData.profileImage)}
            alt={userData.walletAddress}
            className={
              currentUser.isProfileImageNft
                ? style.profileImageNft
                : style.profileImage
            }
          />
        </div>

        { currentAccount===userData.walletAddress?
          <div
            className={style.editProfile}
            onClick={() =>
              router.push(`${router.pathname}/?mint=${currentAccount}`)
            }
          >
            <FaRegEdit />
            <span>Edit profile</span>
          </div>:null
        }
      </div>

      <div className={style.details}>
        <div>
          <div className={style.primary}>{userData.name}</div>
        </div>
        <div className={style.secondary}>
          {userData.walletAddress && (
            <>
              @{userData.walletAddress.slice(0, 8)}...
              {userData.walletAddress.slice(37)}
            </>
          )}
        </div>
        <div>{
          userData.bio}
        </div>
      </div>
      <div className={style.nav}>
        <div className={style.activeNav}>Tweets</div>
        <div>Media</div>
        <div>Likes</div>
      </div>
    </div>
  );
};

export default ProfileHeader;
