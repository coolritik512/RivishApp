import { useState, useContext } from 'react'
import { TwitterContext } from '../../../context/TwitterContext'
import { useRouter } from 'next/router'
import { client } from '../../../lib/client'
import { contractABI, contractAddress } from '../../../lib/constants'
import { ethers } from 'ethers'
import InitialState from './InitialState'
import LoadingState from './LoadingState'
import FinishedState from './FinishedState'
import { pinJSONToIPFS, pinFileToIPFS } from '../../../lib/pinata'
import { type } from 'os'
import { uploadImagesToPintata } from '../../../common/pintatafunction'
import { getEthereumContract } from '../../../common/contractfunction'

declare let window: any

let metamask: any

if (typeof window !== 'undefined') {
  metamask = window.ethereum
}

interface Metadata {
  name: string
  description: string
  image: string
}

interface HeaderObject {
  key: string | undefined
  value: string | undefined
}


const createPinataRequestHeaders = (headers: Array<HeaderObject>) => {
  const requestHeaders: HeadersInit = new Headers()

  headers.forEach((header: any) => {
    requestHeaders.append(header.key, header.value)
  })

  return requestHeaders
}

const ProfileImageMinter = () => {
  const { currentAccount, setAppStatus,currentUser } = useContext(TwitterContext);
  // console.log(curren/tUser);
  const router = useRouter()

  const [name, setName] = useState(currentUser.name);
  const [description, setDescription] = useState(currentUser.bio);
  const [status, setStatus] = useState('initial')
  const [profileImage, setProfileImage] = useState<File>()
  const [coverImage, setCoverImage] = useState<File>()

  async function uploadDataToSanityAndBlockcain(){
    const request= client.patch(currentAccount);
    let profileImageHash;
    if(profileImage){
      profileImageHash= (await uploadImagesToPintata([profileImage]))[0] ;
      request.set({ profileImage: profileImageHash})  
    }
    else{
      profileImageHash=currentUser.profileImage;
    }

    let coverImageHash;
    if(coverImage){
      coverImageHash = (await uploadImagesToPintata([coverImage]))[0] ;
      request.set({coverImage:coverImageHash})
    }
    else{
      coverImageHash=currentUser.coverImage;
    }

    if(name!='')
    request.set({name:name})
    request.set({ isProfileImageNft: true })
    if(description)
    request.set({bio:description})
    await request.commit();
    
    uploadDataToblockchain(profileImageHash);
    
  }

  async function uploadDataToblockchain(profileImageHash=[]){
    const contract =  getEthereumContract();

    const transactionParameters = {
      to: contractAddress,
      from: currentAccount,
      data: await contract.mint(currentAccount, `ipfs://${profileImageHash[0]}`),
    }

    try {
      await metamask.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      })

      setStatus('finished')
    } catch (error: any) {
      console.log(error)
      setStatus('finished')
    }
  }

  const mint = async () => {
    setStatus('loading');
    await uploadDataToSanityAndBlockcain();
  }

  const renderLogic = (modalStatus = status) => {
    switch (modalStatus) {
      case 'initial':
        return (
          <InitialState
            profileImage={profileImage!}
            setProfileImage={setProfileImage}
            coverImage={coverImage!}
            setCoverImage={setCoverImage}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            mint={mint}
          />
        )

      case 'loading':
        return <LoadingState />

      case 'finished':
        return <FinishedState />

      default:
        router.push('/')
        setAppStatus('error')
        break
    }
  }

  return <>{renderLogic()}</>
}

export default ProfileImageMinter
