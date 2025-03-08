import { useState, useEffect } from 'react';
import { fetchImage } from '@/api/rest/image';

interface ImageProps {
  imageURL?: string;
  alt?: string;
  classname?: string;
  onClick?: () => void;
}

const imageCache = new Map<string, string>();

function Image({ imageURL = '', alt = '', classname = '', onClick = () => {} }: ImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const prepareImage = async () => {
      try {
        if (!imageURL) {
          setImageSrc("/public/nophoto.jpg");
          return;
        }

        if (imageURL.startsWith('/public/')) {
          setImageSrc(imageURL);
          return;
        }

        if (imageCache.has(imageURL)) {
          setImageSrc(imageCache.get(imageURL) as string);
          return;
        }

        const response = await fetchImage(imageURL);

        const imageObjectURL = URL.createObjectURL(response.data);
        imageCache.set(imageURL, imageObjectURL);
        setImageSrc(imageObjectURL);
    
      } catch (error) {
        console.error('Error in image: ', error);
        setImageSrc('/public/nophoto.jpg');
      }
    };

    prepareImage();
  }, [imageURL]);

  return (
    <img
      src={imageSrc || '/public/nophoto.jpg'}
      alt={alt}
      className={classname}
      onClick={onClick}
    />
  );
}

export default Image;
