import { useState } from "react";

/* Scroll-stopper: three tilted columns of real photos drifting in opposite
   directions inside a faded glass frame. Hover to pause.

   PHOTOS: put six files in  public/images/hero/  with these names (any size,
   landscape or portrait, ~900px on the long side is plenty):

     camera-1.jpg  camera-2.jpg        cameras
     equipment-1.jpg  equipment-2.jpg  lenses, lights, tripods, gimbals
     people-1.jpg  people-2.jpg        clients, selfies, the team

   `src` can also be a full URL, so you can paste a CDN link instead.
   Or pass your own list:
     <ScrollStopper images={[{ src, alt, kind: "camera" | "equipment" | "people" }]} />
   Until a photo exists, its card shows a soft shimmer instead. */

const captions = { camera: "Cameras", equipment: "Equipment", people: "People" };

const defaultImages = [
  { src: "/images/hero/camera-1.jpg", alt: "Professional mirrorless camera", kind: "" },
  { src: "/images/hero/equipment-1.jpg", alt: "Camera lenses and studio equipment", kind: "" },
  { src: "/images/hero/people-1.jpg", alt: "Smiling client during a photo session", kind: "" },
  { src: "/images/hero/people-2.jpg", alt: "Friends taking a selfie together", kind: "" },
  { src: "/images/hero/camera-2.jpg", alt: "Photographer holding a camera", kind: "" },
  { src: "/images/hero/equipment-2.jpg", alt: "Tripod and lighting setup", kind: "" },
];

function Card({ image }) {
  const [failed, setFailed] = useState(false);
  const showImage = image.src && !failed;

  return (
    <figure className="ss-card" data-kind={image.kind}>
      {showImage ? (
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          decoding="async"
          draggable="false"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="ss-fallback" role="img" aria-label={image.alt} />
      )}
      <figcaption className="ss-chip">
        <span className="ss-dot" />
        {image.caption || captions[image.kind]}
      </figcaption>
    </figure>
  );
}

function ScrollStopper({ images = defaultImages }) {
  // deal the images across three columns
  const columns = [[], [], []];
  images.forEach((image, i) => columns[i % 3].push(image));

  return (
    <div className="scrollstop" role="group" aria-label="Photo gallery of cameras, equipment and people">
      <div className="scrollstop-grid">
        {columns.map((column, c) => (
          <div className="scrollstop-col" key={c}>
            <div className="scrollstop-track" style={{ "--dur": `${[26, 34, 30][c]}s` }}>
              {/* three copies so the loop never shows a gap */}
              {[0, 1, 2].map((copy) =>
                column.map((image, i) => (
                  <div key={`${copy}-${i}`} aria-hidden={copy > 0 ? "true" : undefined}>
                    <Card image={image} />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ScrollStopper;