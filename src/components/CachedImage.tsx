import React from 'react';
import { Image, ImageProps } from 'expo-image';

interface CachedImageProps extends Omit<ImageProps, 'source'> {
  uri?: string;
  cacheKey?: string;
}

const CachedImage: React.FC<CachedImageProps> = ({ uri, cacheKey, ...props }) => {
  if (!uri) return null;

  return (
    <Image
      {...props}
      source={{ uri, cacheKey: cacheKey ?? uri }}
      cachePolicy="disk"
      allowDownscaling
    />
  );
};

export default CachedImage;
