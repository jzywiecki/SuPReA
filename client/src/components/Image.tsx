import { useState, useEffect } from 'react';
import axiosInstance from '@/services/api'; 

interface ImageProps {
  imageURL?: string;
  alt?: string;
  classname?: string;
  onClick?: () => void;
}


function Image({ imageURL = '', alt = '', classname = '', onClick = () => {} }: ImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        console.log("url", imageURL);

        const response = await axiosInstance.get(imageURL, {
          responseType: 'blob',
          headers: {
            'Accept': 'image/jpeg',
          },
        });

        const imageUrl = URL.createObjectURL(response.data);
        setImageSrc(imageUrl);
        
      } catch (error) {
        console.error('Error in image: ', error);
      }
    };

    if (imageURL) {
      fetchImage();
    }
  }, [imageURL]);

  return (
    <img
      src={imageSrc || 'https://via.placeholder.com/150'}
      alt={alt}
      className={classname}
      onClick={onClick}
    />
  );
}

export default Image;
