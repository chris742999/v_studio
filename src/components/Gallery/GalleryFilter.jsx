const categories = [
  "Wedding",
  "Portrait",
  "Graduation",
  "Corporate",
  "Events",
  "Nature",
];

export default function GalleryFilter({
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-16">
      {categories.map((category) => {
        const active = selectedCategory === category;

        return (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-6 py-3 rounded-full
              border backdrop-blur-lg
              transition-all duration-300
              ${
                active
                  ? "bg-cyan-500 border-cyan-400 text-black shadow-lg shadow-cyan-500/40 scale-105"
                  : "bg-white/5 border-white/10 text-white hover:bg-cyan-500 hover:border-cyan-400 hover:text-black hover:shadow-lg hover:shadow-cyan-500/30"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}