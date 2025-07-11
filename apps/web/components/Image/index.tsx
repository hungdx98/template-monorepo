import cx from "@/utils/styled";
import NextImage, { ImageProps } from 'next/image';
import { SyntheticEvent, useState } from "react";


const Image = (props: ImageProps) => {
  const {
    src,
    alt = 'Image',
    className,
  } = props;

   const emptyImage =  '/images/logo/unknown.png';

  const [isError, setIsError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const formatSrc = src

  const handleLoadError = (
    e: SyntheticEvent<HTMLImageElement | HTMLVideoElement>,
  ) => {
    e.currentTarget.src = emptyImage;
    setIsError(true);
    setIsImageLoaded(true);
  };

  const handleLoadImage = () => {
    setIsImageLoaded(true);
  };
  return (
     <>
          <NextImage
            width={props.width || 32 }
            height={props.height || 32}
            {...props}
            src={(isError || !formatSrc) ? emptyImage : formatSrc}
            alt={alt}
            className={cx(
              className,
            )}
            onError={handleLoadError}
            onLoadingComplete={handleLoadImage}
          />
          {/* {!isImageLoaded && <div className="absolute inset-0 bg-background-third animate-pulse z-20" />} */}
        </>
  );
}
 
export default Image;