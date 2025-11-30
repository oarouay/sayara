
export default function BrandScroller() {
  const brands = [
    { name: "Toyota", logo: "/data/toyota.svg" },
    { name: "BMW", logo: "/data/BMW.svg" },
    { name: "Mercedes", logo: "/data/mercedes.svg" },
    { name: "Audi", logo: "/data/audi.svg" },
    { name: "Ford", logo: "/data/ford.svg" },
    { name: "Peugeot", logo: "/data/peugeot.svg" },
    { name: "Renault", logo: "/data/Renault.svg" },
    { name: "Kia", logo: "/data/kia.svg" },
    { name: "Hyundai", logo: "/data/hyundai.svg" },
  ];

  // Duplicate array for seamless infinite loop
  const scrollBrands = [...brands, ...brands];

  return (
    <section className="py-10 bg-white overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Our <span className="text-green-600">Trusted</span> Partners
        </h2>


      <div className="relative w-full overflow-hidden">
        {/* Scrolling container */}
        <div className="flex gap-10 brand-scroll-animation hover:[animation-play-state:paused]">
          {scrollBrands.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="min-w-[160px] flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain grayscale hover:grayscale-0 transition"
                />
              </div>
              <p className="mt-2 text-green-700 font-semibold text-sm">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Animation style - moved to global CSS to avoid hydration issues */}
      <style jsx global>{`
        .brand-scroll-animation {
          animation: brand-scroll 18s linear infinite;
        }
        @keyframes brand-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}