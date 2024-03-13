import { useEffect, useState } from "react";
import useAuthHttpClient from "../../hooks/useAuthHttpClient";
import { imagefrombuffer } from "imagefrombuffer";
const ImageConverter = () => {
  //   const [files, setFiles] = useState([]);
  const convert = (e) => {
    // setFiles(e.target.files);
    if (e.target.files[0].size > 2000000) {
      console.log("File too large");
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      setImageBuffer(reader.result);
      console.log(typeof reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const [imageBuffer, setImageBuffer] = useState([]);
  //   const authClientHttp = useAuthHttpClient();
  //   useEffect(() => {
  //     const getImage = async () => {
  //       try {
  //         const response = await authClientHttp.get("/image/");
  //         setImageBuffer(response.data.data[0].fileData.data);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     getImage();
  //   }, []);

  console.log(imageBuffer);
  return (
    <>
      <input accept="image/*" id="button-file" type="file" onChange={convert} />
      <label htmlFor="button-file">
        <button>Add Additional Images</button>
      </label>
      <img alt="dfsfasd" src={imageBuffer} />
    </>
  );
};

export default ImageConverter;
