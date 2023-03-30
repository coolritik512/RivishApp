import { useRouter } from "next/router";
import React from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import ShortUserProfileComponent from "./profile/shortUserProfileComponent";
const style = {
  wrapper: `border-[#38444d] border-b`,
  header: `py-1 px-3 mt-2 flex items-center`,
  primary: `bg-transparent outline-none font-bold`,
  secondary: `text-[#8899a6] text-lg font-bold`,
  backButton: `text-3xl cursor-pointer mr-2 rounded-full hover:bg-[#313b44] p-1`,
  coverPhotoContainer: `flex items-center justify-center h-[30vh] overflow-hidden`,
  details: `px-3`,
};
export default function Follw({
  UserList,
  LinkedType,
}: {
  UserList: Array<any>;
  LinkedType: string | null;
}) {
  const router = useRouter();
  console.log(UserList);
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className={style.header}>
        <div onClick={() => router.push("/")} className={style.backButton}>
          <BsArrowLeftShort />
        </div>
        <div className={style.details}>
          <div className={style.secondary}>{LinkedType?.toUpperCase()}</div>
        </div>
      </div>
      {UserList.map((user) => {
        const { profileImage, walletAddress, isProfileImageNft, name } = user;
        return (
          <ShortUserProfileComponent
            profileImageLink={profileImage}
            userName={walletAddress}
            isProfileImageNft={isProfileImageNft}
            displayName={name}
          />
        );
      })}
    </div>
  );
}
