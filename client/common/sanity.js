import { client } from '../lib/client'

// export async function searchForUserInSanity(userName){
//     const query = `
//       *[_type == "users" && name match '*${userName}*' || walletAddress match '${userName}']{
//         name,
//         profileImage,
//         isProfileImageNft,
//         coverImage,
//         walletAddress,
//       }
//     `

//     console.log(query);

//     const response = await client.fetch(query);
//     console.log(response);
// }