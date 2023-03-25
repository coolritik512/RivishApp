import React, { useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { searchForUserInSanity } from "../common/sanity";
import ShortUserProfileComponent from "./profile/shortUserProfileComponent";
import UserSearchResult from "./userSearchResult";
const style = {
  wrapper: `flex-[1] p-4`,
  searchBar: `flex items-center bg-[#243340] p-2 rounded-3xl relative`,
  searchIcon: `text-[#8899a6] mr-2`,
  inputBox: `bg-transparent outline-none`,
};
export default function SearchBar({
  searchType,
  setSearchedData,
}: {
  searchType: string;
  setSearchedData?: Function;
}) {
  const [UserFound, setUserFound] = useState([]);

  console.log(UserFound);

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
      const data = await searchForUserInSanity(searchedUser, searchType);
      if (setSearchedData) {
        setSearchedData(data);
      } else {
        setUserFound(data);
      }
    } else {
      setUserFound([]);
      if(setSearchedData)
      setSearchedData([]);
    }
  }
  return (
    <div className={style.searchBar}>
      <BiSearch className={style.searchIcon} />
      <input
        placeholder="Search Rivish"
        type="text"
        className={style.inputBox}
        onChange={debounce}
      />
      <UserSearchResult searchedData={UserFound} styleClass={'absolute mt-28'}/>
    </div>
  );
}
