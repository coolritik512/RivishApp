import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { client } from "../lib/client";
const style = {
  wrapper: `flex-[1] p-4`,
  searchBar: `flex items-center bg-[#243340] p-2 rounded-3xl relative`,
  searchIcon: `text-[#8899a6] mr-2`,
  inputBox: `bg-transparent outline-none`,
  section: `bg-[#192734] my-6 rounded-xl overflow-hidden`,
  title: `p-2 font-bold text-lg`,
  showMore: `p-2 text-[#1d9bf0] text-sm cursor-pointer hover:bg-[#22303c]`,

};
export default function WhatHappening() {
  const [FamousPost, setFamousPost] = useState([]);
  const router=useRouter();

  async function loadTopTrendingPost() {
    const query = `
    *[_type == "tweets" && Title!='']{
      Title,
    }|order(RePost) | order(timestamp)[0...5]`;
    const res = await client.fetch(query);
    console.log(res);
    setFamousPost(res);
  }

  function openTheTrending(Trending:string){
    router.push({pathname:'/Search',query:{Trending:Trending}});
  }

  useEffect(() => {
    loadTopTrendingPost();
  }, []);

  return (
    <div className={style.section}>
      <div className={style.title}>What's happening</div>
      {FamousPost.map((item:any, index) => (
        <div
        className=" text-lg  w-full  bg-gray-600 p-2 border-b m-1 border-white rounded-xl" onClick={()=>openTheTrending(item.Title)}>#{item.Title}</div>
      ))}
    </div>
  );
}
