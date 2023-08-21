import React, { useState } from "react";
import { Box } from "@mui/system";
import Image from "next/image";
import { TImageInfo } from "@src/types/product.types";

interface ImageFadeProps {
  primaryImage?: TImageInfo;
  title: string;
  width?: number;
  height?: number;
}

const ImageFade: React.FC<ImageFadeProps> = ({
  primaryImage,
  width,
  height,
  title,
}) => {
  const [opacity, setOpacity] = useState(0);

  React.useEffect(() => {
    setTimeout(() => {
      setOpacity(1);
    }, 1000);
  }, []);

  return (
    <Box
      width={width || "100%"}
      height={height || "100%"}
      position="relative"
      sx={{ opacity, transition: "all 0.5s ease-in-out" }}
    >
      <Image
        src={
          primaryImage?.url ||
          `https://fakeimg.pl/${width ?? 140}x${
            height ?? width ?? 200
          }?text=No+Image`
        }
        alt={primaryImage?.alt ?? title}
        fill={true}
        style={{ objectFit: "contain" }}
      />
    </Box>
  );
};

export default ImageFade;
