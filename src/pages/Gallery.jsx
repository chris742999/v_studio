import { useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import AnimatedBackground from "../components/Background/AnimatedBackground";
import GalleryHero from "../components/Gallery/GalleryHero";
import GalleryFilter from "../components/Gallery/GalleryFilter";
import FloatingGallery from "../components/Gallery/FloatingGallery";
import MasonryGallery from "../components/Gallery/MasonryGallery";
import GalleryCTA from "../components/Gallery/GalleryCTA";
import Lightbox from "../components/Gallery/Lightbox";

export default function Gallery() {
  // Default featured collection
  const [selectedCategory, setSelectedCategory] = useState("Wedding");
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#030712] text-white overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      <div className="relative z-10">
        <Navbar />

        {/* Hero */}
        <GalleryHero />

        {/* Gallery Content */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          {/* Category Buttons */}
          <GalleryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Featured Floating Collection */}
          <section className="mt-14">
            <div className="text-center mb-16">
            

              <p className="text-cyan-400 text-2xl font-medium">
                {selectedCategory} Photography
              </p>

              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Explore our featured {selectedCategory.toLowerCase()} moments
                through an interactive floating collection.
              </p>
            </div>

<FloatingGallery
    category={selectedCategory}
    onImageClick={setSelectedImage}
/>          </section>

          {/* Pinterest Gallery */}
          <section className="mt-8">
      

<MasonryGallery
    onImageClick={setSelectedImage}
/>          </section>
        </section>

        <GalleryCTA />
        <Lightbox
    image={selectedImage}
    onClose={() => setSelectedImage(null)}
/>
      </div>
    </div>
  );
}