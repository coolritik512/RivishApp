
import { pinFileToIPFS,pinJSONToIPFS } from "../lib/pinata";

export async function uploadImagesToPintata(PostImage) {
    const ImageUri = [];
    console.log(PostImage);
    for (var i=0;i<PostImage.length;i++) {
      const file=PostImage[i]
      const pinataMetaData = {
        name: `${file.name + Date.now()}`,
      };
      const imageCode = await pinFileToIPFS(file, pinataMetaData);
      ImageUri.push(imageCode);
    }

    return ImageUri;
}
