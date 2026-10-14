import { useEffect } from "react";
import gsap from "gsap";

import galleryData from "./galleryData";
import galleryLayout from "./galleryLayout";
import GalleryCard from "./GalleryCard";

export default function FloatingGallery({
  category,
  onImageClick,
}) {
  // Filter images for selected category
  const filteredImages = galleryData.filter(
    (image) => image.category === category
  );

  const getSize = (size) => {
    switch (size) {
      case "small":
        return 140;

      case "large":
        return 220;

      default:
        return 170;
    }
  };

  useEffect(() => {
    const photos = gsap.utils.toArray(".floating-photo");

    gsap.killTweensOf(photos);

    photos.forEach((photo) => {
      gsap.to(photo, {
        x: gsap.utils.random(-8, 8),
        y: gsap.utils.random(-10, 10),
        rotation: `+=${gsap.utils.random(-2, 2)}`,
        duration: gsap.utils.random(4, 7),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random(),
      });
    });

    return () => {
      gsap.killTweensOf(photos);
    };
  }, [category]);

  return (
    <section className="relative h-[450px] overflow-hidden">
      {filteredImages.map((image, index) => {
        const pos = galleryLayout[index % galleryLayout.length];

        return (
          <div
            key={image.id}
            className="floating-photo absolute"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `rotate(${pos.rotate}deg) scale(${pos.scale})`,
              width: `${getSize(pos.size)}px`,
              zIndex: pos.z,
            }}
          >
            <GalleryCard
              image={image.image}
              title={image.title}
              onClick={() => onImageClick(image)}
            />
          </div>
        );
      })}
    </section>
  );
}