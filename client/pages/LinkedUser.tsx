import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getEthereumContract } from "../common/contractfunction";
import { searchForUserInSanity } from "../common/sanity";
import Follow from "../components/Follow";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";

const style = {
  wrapper: `flex justify-center h-screen w-screen select-none bg-[#15202b] text-white`,
  content: `w-full flex justify-between`,
  mainContent: `flex-[2] border-r border-l border-[#38444d] overflow-y-scroll no-scrollbar`,
};
// declare let window: any;

export default function Follower() {
  // let window: any;
  let params;
  let userAddress: any = "";
  let LinkedType: any = "";

  if (typeof window !== "undefined") {
    params = new URLSearchParams(window?.location?.search);
    userAddress = params.get("userAddress");
    LinkedType = params.get("LinkedType");
  }

  const [LinkedUserList, setLinkedUserList] = useState<any>();

  async function fetchAllFollower() {
    const contract = getEthereumContract();
    const followerAddress = await contract.getFollowerDetails(userAddress);
    let temp = [];
    for (const useraddress of followerAddress) {
      const res = await searchForUserInSanity(useraddress, "User");
      temp.push(res[0]);
    }
    setLinkedUserList(temp);
  }

  async function fetchAllFollowing() {
    const contract = getEthereumContract();
    const followerAddress = await contract.getFollowingDetails(userAddress);
    let temp = [];
    for (const useraddress of followerAddress) {
      const res = await searchForUserInSanity(useraddress, "User");
      temp.push(res[0]);
    }
    setLinkedUserList(temp);
  }

  useEffect(() => {
    console.log(LinkedType, userAddress);
    if (LinkedType == "follower") {
      fetchAllFollower();
    } else {
      fetchAllFollowing();
    }
  }, []);

  console.log(LinkedUserList);

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <Sidebar initialSelectedIcon={""} />
        <div className={style.mainContent}>
          <Follow UserList={LinkedUserList} LinkedType={LinkedType} />
        </div>
        <Widgets />
      </div>
    </div>
  );
}
