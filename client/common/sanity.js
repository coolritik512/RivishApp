import { client } from '../lib/client'

export async function searchForUserInSanity(userName, searchType) {
  let query
  if (searchType == 'User') {
    query = `
      *[_type == "users" && name match '*${userName}*' || walletAddress match '${userName}']{
        name,
        profileImage,
        isProfileImageNft,
        walletAddress,
      }`;
  }
  else if (searchType == 'Post') {
    query = `
    *[_type == "tweets" && Title match '*${userName}*']{
      "author": author->{name, walletAddress, profileImage, isProfileImageNft},
      tweet,
      timestamp,
      Title
    }|order(timestamp desc)`;

  }

  console.log(query);
  
  const response = await client.fetch(query);
  console.log(response);
  return response;
}