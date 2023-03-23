import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTweets from "../components/profile/ProfileTweets";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import Modal from "react-modal";
import ProfileImageMinter from "../components/profile/mintingModal/ProfileImageMinter";
import { useRouter } from "next/router";
import { customStyles } from "../lib/constants";
import { useEffect, useState } from "react";

const style = {
  wrapper: `flex justify-center h-screen w-screen select-none bg-[#15202b] text-white `,
  content: `w-full flex justify-between `,
  mainContent: `flex-[2] border-r border-l border-[#38444d] overflow-y-scroll no-scrollbar`,
};

declare let window: any;

const profile = () => {

  console.log('profile component')
  const router = useRouter();
  const params = new URLSearchParams(window.location.search);
  const [searchedUser,setsearchedUser] = useState(params.get('userName'));

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        {searchedUser !=null ? (
          <Sidebar initialSelectedIcon={""} />
        ) : (
          <Sidebar initialSelectedIcon={"Profile"} />
        )}
        <div className={style.mainContent}>
          <ProfileHeader />
          <ProfileTweets />
        </div>
        <Widgets />

        <Modal
          isOpen={Boolean(router.query.mint)}
          onRequestClose={() => router.back()}
          style={customStyles}
        >
          <ProfileImageMinter />
        </Modal>
      </div>
    </div>
  );
};

export default profile;
