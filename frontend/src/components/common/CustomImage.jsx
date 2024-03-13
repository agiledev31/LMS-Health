import React, { useState } from "react";

const CustomImage = ({ src, alt, className }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        className={isFullscreen ? "fullscreen" : ""}
        onClick={toggleFullscreen}
      />
    </div>
  );
};

export default CustomImage;
