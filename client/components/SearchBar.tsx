import React, { useEffect, useRef, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { searchForUserInSanity } from "../api/sanity";
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
  Trending,
}: {
  searchType: string;
  setSearchedData?: Function;
  Trending?: string;
}) {
  const [UserFound, setUserFound] = useState([]);
  const [TrendingSearch, setTrendingSearch] = useState(Trending);

  const TimerOut = useRef<number>();

  function debounce(event: any) {
    let searchedUser = event.target.value;

    if (TimerOut.current) {
      clearTimeout(TimerOut.current);
    }
    const Timer = setTimeout(() => searchUser(searchedUser), 300);
    TimerOut.current = parseInt("" + Timer);
  }
  const input = useRef<any>();

  useEffect(() => {
    // console.log('effect')
    if (Trending) {
      // searchType='Post';
      searchUser(Trending);
    }
  }, [searchType]);

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
      if (setSearchedData) setSearchedData([]);
    }
  }
  return (
    <div className={style.searchBar}>
      <BiSearch className={style.searchIcon} />
      <input
        ref={input}
        placeholder="Search Rivish"
        className={style.inputBox}
        onChange={debounce}
        defaultValue={Trending}
      />
      <UserSearchResult
        searchedData={UserFound}
        styleClass={"absolute mt-28"}
      />
    </div>
  );
}
