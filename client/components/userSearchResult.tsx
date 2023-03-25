import React from "react";
import ShortUserProfileComponent from "./profile/shortUserProfileComponent";

export default function UserSearchResult({
  searchedData,styleClass
}: {
  searchedData: Array<any>;
  styleClass?:string
}) {
  return (
    <div className={`${styleClass} rounded-3xl px-1 w-full`}>
      {searchedData.length > 0
        ? searchedData.map((user, index) => {
            const { isProfileImageNft, name, profileImage, walletAddress } =
              user;
            return (
              <div
                key={index}
                className={"h-full w-full bg-slate-600 rounded-3xl p-1"}
              >
                <ShortUserProfileComponent
                  profileImageLink={profileImage}
                  userName={walletAddress}
                  displayName={name}
                  isProfileImageNft={isProfileImageNft}
                />
              </div>
            );
          })
        : null}
    </div>
  );
}
