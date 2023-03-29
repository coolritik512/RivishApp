import { news, whoToFollow } from "../lib/static";
import { BiSearch } from "react-icons/bi";
import { searchForUserInSanity } from "../common/sanity";
import { useRef, useState } from "react";
import ShortUserProfileComponent from "./profile/shortUserProfileComponent";
import SearchBar from "./searchBar";
import WhatHappening from "./WhatHappening";

const style = {
  wrapper: `flex-[1] p-4`,
  searchBar: `flex items-center bg-[#243340] p-2 rounded-3xl relative`,
  searchIcon: `text-[#8899a6] mr-2`,
  inputBox: `bg-transparent outline-none`,
  section: `bg-[#192734] my-6 rounded-xl overflow-hidden`,
  title: `p-2 font-bold text-lg`,
  showMore: `p-2 text-[#1d9bf0] text-sm cursor-pointer hover:bg-[#22303c]`,
  item: `flex items-center p-3 my-2 hover:bg-[#22303c] cursor-pointer`,
  newsItemLeft: `flex-1`,
  newsItemCategory: `text-[#8899a6] text-xs font-semibold`,
  newsItemTitle: `text-sm font-bold`,
  newsItemRight: `w-1/5 ml-3`,
  newsItemImage: `rounded-xl h-14 w-14 object-cover`,
  followAvatarContainer: `w-1/6`,
  followAvatar: `rounded-full h-[40px] w-[40px]`,
  profileDetails: `flex-1`,
  name: `font-bold`,
  handle: `text-[#8899a6]`,
  followButton: `bg-white text-black px-3 py-1 rounded-full text-xs font-bold`,
};

function Widgets() {
  // console.log("widgets");

  const [UserFound, setUserFound] = useState([]);
  const [FamousPost,setFamousPost] = useState([])

  const TimerOut = useRef<number>();

  function debounce(event: any) {
    const searchedUser = event.target.value;
    if (TimerOut.current) {
      clearTimeout(TimerOut.current);
    }
    const Timer = setTimeout(() => searchUser(searchedUser), 300);
    TimerOut.current = parseInt("" + Timer);
  }

  async function searchUser(searchedUser: string) {
    if (searchedUser != "") {
      setUserFound(await searchForUserInSanity(searchedUser));
    } else {
      setUserFound([]);
    }
  }

  return (
    <div className={style.wrapper}>
      <SearchBar searchType="User"  />

      <WhatHappening/>
      
      {/* <div className={style.section}>
        <div className={style.title}>Who to follow</div>
        {whoToFollow.map((item, index) => (
          <div key={index} className={style.item}>
            <div className={style.followAvatarContainer}>
              <img
                src={item.avatar}
                alt={item.handle}
                className={style.followAvatar}
              />
            </div>
            <div className={style.profileDetails}>
              <div className={style.name}>{item.name}</div>
              <div className={style.handle}>{item.handle}</div>
            </div>
            <div className={style.followButton}>Follow</div>
          </div>
        ))}
        <div className={style.showMore}>Show more</div>
      </div> */}
    </div>
  );
}

export default Widgets;
