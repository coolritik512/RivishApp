import { Dispatch, SetStateAction } from "react";
import { BsImages } from "react-icons/bs";
import { GiEarthAmerica } from "react-icons/gi";

const style = {
  wrapper: `h-[20rem] w-[50vw] text-white bg-[#15202b] rounded-3xl p-10 flex flex-col`,
  inputFieldsContainer: `flex-1 w-full`,
  inputContainer: `mb-4 w-full flex text-3xl items-center gap-2`,
  fileInput: `hidden`,
  input: `bg-transparent outline-none text-xl w-full`,
  customInput: `bg-white text-black px-3 py-1 rounded-full hover:bg-[#8899a6] cursor-pointer w-full`,
  fileSelected: `bg-[#2b6127] text-white px-3 py-1 rounded-full hover:bg-[#8899a6] cursor-pointer w-full`,
  lower: `flex justify-between items-center`,
  visibility: `flex items-center text-[#1d9bf0] text-sm font-bold`,
  visibilityText: `ml-2`,
  mintButton: `bg-white text-black px-3 py-1 rounded-full hover:bg-[#8899a6] cursor-pointer`,
  inactiveMintButton: `text-black px-3 py-1 rounded-full bg-[#8899a6]`,
};

interface InitialStateProps {
  profileImage: File;
  setProfileImage: Dispatch<SetStateAction<File | undefined>>;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  mint: Function;
  coverImage: File;
  setCoverImage: Function;
}

const InitialState = ({
  profileImage,
  setProfileImage,
  name,
  setName,
  description,
  setDescription,
  mint,
  coverImage,
  setCoverImage,
}: InitialStateProps) => {
  // console.log(profileImage);

  function profileImageUpload(event: any) {
    document.getElementById("image-upload")?.click();
  }

  function coverImageUpload(event: any) {
    document.getElementById("cover-Image")?.click();
  }

  return (
    <div className={style.wrapper}>
      <div className={style.inputFieldsContainer}>
        {/* profile image */}
        <div className={style.inputContainer}>
          <span>Profile Image:</span>
          <BsImages onClick={(e) => profileImageUpload(e)} />
          <input
            type="file"
            id="image-upload"
            accept=".jpg, .jpeg, .png"
            className={"hidden"}
            placeholder="Image URL"
            onChange={(e) => setProfileImage(e.target.files![0])}
          />
        </div>

        <div className={style.inputContainer}>
          <span>Cover Image:</span>
          <BsImages onClick={(e) => coverImageUpload(e)}></BsImages>
          <input
            type="file"
            id="cover-Image"
            accept=".jpg, .jpeg, .png"
            className={"hidden"}
            placeholder="Image URL"
            onChange={(e) => setCoverImage(e.target.files![0])}
          />
        </div>

        {/* text */}
        <div className={style.inputContainer}>
          <input
            type="text"
            className={style.input}
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* des */}
        <div className={style.inputContainer}>
          <input
            type="text"
            className={style.input}
            placeholder="Bio"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className={style.lower}>
        <div className={style.visibility}>
          <GiEarthAmerica />
          <span className={style.visibilityText}>Everyone can see this</span>
        </div>
        <div
          className={style.mintButton}
          onClick={() => {
            mint();
          }}
        >
          Mint
        </div>
      </div>
    </div>
  );
};

export default InitialState;
