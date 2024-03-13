import React, { useEffect, useState } from "react";

const FileUpload = ({ selectedFile, setSelectedFile, defaultImageUrl }) => {
  const [dragging, setDragging] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(defaultImageUrl);
  const fileInputId = Math.floor(
    Math.random() * Math.floor(Math.random() * Date.now())
  ).toString();
  useEffect(() => {
    if (defaultImageUrl) {
      setImagePreviewUrl(defaultImageUrl);
    }
    if (selectedFile) {
      handleFiles([selectedFile]);
    }
  }, [defaultImageUrl]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };
  const isFile = (fileName) => {
    return !fileName.startsWith("uploads");
  };
  const isImage = (fileName) => {
    if (fileName.startsWith("data:image")) {
      return true;
    }
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  };
  const handleFiles = (files) => {
    try {
      if (files && files[0]) {
        setSelectedFile(files[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviewUrl(reader.result);
        };
        reader.readAsDataURL(files[0]);
      }
    } catch (ex) {
      alert(ex.toString());
    }
  };

  return (
    <div
      className={`p-4 border-2 border ${
        dragging ? "border-blue-500 bg-blue-100" : "border-primary-600"
      } rounded-md`}
    >
      <input
        type="file"
        onChange={(e) => handleFiles(e.target.files)}
        style={{ display: "none" }}
        id={fileInputId}
      />
      <label
        htmlFor={fileInputId}
        className="cursor-pointer text-gray-500"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {imagePreviewUrl ? (
          <>
            {isImage(imagePreviewUrl) ? (
              <img
                src={
                  !isFile(imagePreviewUrl)
                    ? process.env.REACT_APP_SERVER_URL + "/" + imagePreviewUrl
                    : imagePreviewUrl
                }
                alt="Preview"
                className="mx-auto max-w-[150px]"
              />
            ) : (
              <video style={{ maxWidth: "100%", maxHeight: "200px" }} controls>
                <source
                  src={
                    !isFile(imagePreviewUrl)
                      ? process.env.REACT_APP_SERVER_URL + "/" + imagePreviewUrl
                      : imagePreviewUrl
                  }
                />
                Your browser does not support the video tag.
              </video>
            )}
          </>
        ) : (
          <>
            <svg
              class="text-gray w-14 mx-auto mb-4 border-[3px] border-[#FAF9F6] p-3 rounded-[5px]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </>
        )}
        <div className="flex w-max mx-auto text-center">
          <span className="text-primary-600 text-[17px] font-semibold mr-2">
            Upload
          </span>
          or drop files here
        </div>
      </label>
    </div>
  );
};

export default FileUpload;
