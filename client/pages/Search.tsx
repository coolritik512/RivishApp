import React, { useEffect, useState } from "react";
import PostSearchResult from "../components/PostSearchResult";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/Sidebar";
import UserSearchResult from "../components/userSearchResult";
import Widgets from "../components/Widgets";

const style = {
  wrapper: `flex justify-center h-screen w-screen select-none bg-[#15202b] text-white`,
  content: `w-full flex justify-between`,
};

export default function Search() {
  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <Sidebar initialSelectedIcon={"Explore"} />
        <ExploreComponent />
        <Widgets />
      </div>
    </div>
  );
}

function SearchFilterOptions({
  type,
  isActive,
  setSelected,
}: {
  type: string;
  isActive: boolean;
  setSelected: Function;
}) {
  return (
    <button
      className={`${
        isActive ? "bg-gray-400" : "bg-[#333c40]"
      } rounded-2xl px-2 h-8  font-semibold"`}
      onClick={() => setSelected(type)}
    >
      {type}
    </button>
  );
}


// declare let window: any;

function ExploreComponent() {
  let params;
  let Trending='';

  if (typeof window !== "undefined") {
    params = new URLSearchParams(window?.location?.search);
    Trending = params.get("Trending") ?? "";
  }

  const [selected, setSelected] = useState("User");
  const [searchedData, setSearchedData] = useState([]);

  useEffect(() => {
    if (Trending) {
      setSelected("Post");
    }
  });

  function changeFilter(type: string) {
    setSelected(type);
    setSearchedData([]);
  }

  // console.log(searchedData);
  return (
    <div className="w-[50vw] border p-2 flex-[2] border-r border-l border-[#38444d] overflow-y-scroll relative no-scrollbar">
      <SearchBar
        Trending={Trending}
        searchType={selected}
        setSearchedData={setSearchedData}
      />
      <div className=" text-xl w-full flex  text-zinc-300 gap-2 mt-2 border-b border-gray-400 p-2">
        <SearchFilterOptions
          type="User"
          isActive={selected == "User" ? true : false}
          setSelected={changeFilter}
        />
        <SearchFilterOptions
          type="Post"
          isActive={selected == "Post" ? true : false}
          setSelected={changeFilter}
        />
      </div>

      {selected == "User" ? (
        searchedData.length > 0 ? (
          <UserSearchResult searchedData={searchedData} styleClass={"mt-2"} />
        ) : (
          <div className=" font-bold text-4xl w-full text-center text-gray-400 ">
            No User Found
          </div>
        )
      ) : null}
      {selected == "Post" ? (
        searchedData.length > 0 ? (
          <PostSearchResult searchedData={searchedData} />
        ) : (
          <div className=" font-bold text-4xl w-full text-center text-gray-400 ">
            No Post Found
          </div>
        )
      ) : null}
    </div>
  );
}
