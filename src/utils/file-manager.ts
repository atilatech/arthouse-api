import axios from "axios";
import fs from "fs";
import path from "path";


// fileUrl: the absolute url of the image or video you want to download
// downloadFolder: the path of the downloaded file on your machine
const downloadFile = async (fileUrl: string) => {
  // Get the file name
  const fileName = path.basename(fileUrl);

  // The path of the downloaded file on our machine

  const imagesDirectory = path.resolve(__dirname, 'ipfsUploads');

  if (!fs.existsSync(imagesDirectory)){
    fs.mkdirSync(imagesDirectory);
  }

  const localFilePath = path.resolve(imagesDirectory, fileName);
  try {
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
    });

    const streamHandler = response.data.pipe(fs.createWriteStream(localFilePath));

    return new Promise(function(resolve, reject) {
        streamHandler.on('finish', () => {
            console.log('Successfully downloaded file!');
            resolve(fileUrl)
          });
        streamHandler.on('error', reject); // or something like that. might need to close `hash`
    });

    
  } catch (err: any) { 
    throw new Error(err);
  }
};

const IMAGE_URL = 'https://www.kindacode.com/wp-content/uploads/2021/01/test.jpg';

(async function() {
    let result = await downloadFile(IMAGE_URL);
    console.log({result});
}());