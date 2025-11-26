import ImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';
import styled from 'styled-components';

import { CarouselImageModel } from '@/models/carousel-image.model';

type CarouselProps = Omit<ReactImageGalleryProps, 'items'> & {
  images?: CarouselImageModel[];
  className?: string;
};

export const Carousel = (props: CarouselProps) => {
  const { images, className, ...galleryProps } = props;

  return (
    <CarouselRoot className={className}>
      <ImageGallery
        {...galleryProps}
        items={
          images?.map((images) => ({
            original: images.originalUrl,
            thumbnail: images.thumbnailUrl,
          })) ?? []
        }
      />
    </CarouselRoot>
  );
};

const CarouselRoot = styled.div`
  width: 100%;
  
  height: auto;
  aspect-ratio: 16 / 9;
  max-height: clamp(240px, 40vh, 560px);
  overflow: hidden;
  background-color: #8080806a;

  
  .image-gallery-content:not(.fullscreen) .image-gallery-image {
    height: 100%;
    padding-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  
  .image-gallery-content:not(.fullscreen) .image-gallery-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
  }

  .image-gallery-thumbnail-image {
    height: 56px;
    width: auto;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    object-position: center;
  }
`;

