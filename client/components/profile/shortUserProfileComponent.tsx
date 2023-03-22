import { Router,useRouter } from "next/router";
import React from "react";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { format } from "timeago.js";
import { getNftProfileImage } from "../../context/TwitterContext";

const style = {
  wrapper: `flex p-3 border-b border-[#38444d] w-[full]`,
  profileImage: `rounded-full h-[40px] w-[40px] object-cover`,
  postMain: `flex-1 relative`,
  headerDetails: `flex items-center`,
  name: `font-bold mr-1 `,
  verified: `text-[0.8rem]`,
  handleAndTimeAgo: `text-[#8899a6] ml-1`,
  tweet: `my-2`,
  image: `rounded-3xl`,
  footer: `flex justify-between mr-28 mt-4 text-[#8899a6]`,
  footerIcon: `rounded-full text-lg p-2`,
};

export default function ShortUserProfileComponent({profileImageLink,userName,isProfileImageNft,displayName,timestamp}:{
    profileImageLink:string,userName:string,isProfileImageNft:Boolean|undefined,displayName:string,timestamp:string
}){

  console.log(profileImageLink);

    const router=useRouter();

    function openUserProfile(){
        router.push({ pathname: `/profile`, query: { userName } });
    }
  return (
    <div className={"flex gap-2"}>
      <div>
        <img
          src={getNftProfileImage(profileImageLink)}
          alt={userName}
          className={
            isProfileImageNft
              ? `${style.profileImage} smallHex`
              : style.profileImage
          }
        />
      </div>
      <span className={style.headerDetails}>
        <span className={style.name + ' hover:underline cursor-pointer'} onClick={openUserProfile} >{displayName}</span>
        {isProfileImageNft && (
          <span className={style.verified}>
            <BsFillPatchCheckFill />
          </span>
        )}
        <span className={style.handleAndTimeAgo}>
          @{`${userName.slice(
            0,
            4,
          )}...${userName.slice(41)}`} • {format(new Date(timestamp).getTime())}
        </span>
      </span>
    </div>
  );
}
