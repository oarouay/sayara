
'use client';

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
    { name: "Volkswagen", logo: "/data/vw.svg" },
    { name: "Honda", logo: "/data/honda.svg" },
    { name: "Nissan", logo: "/data/nissan.svg" },
    { name: "Peugeot", logo: "/data/peugeot.svg" },
    { name: "Subaru", logo: "/data/subaru.svg" },
    { name: "Chevrolet", logo: "/data/chevrolet.svg" },
    { name: "Jeep", logo: "/data/jeep.svg" },
    { name: "Mazda", logo: "/data/mazda.svg" },
  ];

  // Duplicate array for seamless infinite loop
  const scrollBrands = [...brands, ...brands];
  const brandCount = brands.length;
  const scrollDistance = `calc(-1 * 160px * ${brandCount} - 1 * 40px * ${brandCount})`;

  return (
    <section className="py-10 bg-white dark:bg-gray-800 overflow-hidden transition-colors duration-200">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white text-center mb-8">
          Our <span className="text-green-600 dark:text-green-400">Trusted</span> Partners
        </h2>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(${scrollDistance});
          }
        }
        
        .brand-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>

      <div className="relative w-full overflow-hidden">
        {/* Scrolling container */}
        <div
          className="flex gap-10 brand-scroll"
          style={{ scrollBehavior: 'auto' }}
        >
          {scrollBrands.map((brand, idx) => (
            <div
              key={`${brand.name}-${idx}`}
              className="min-w-[160px] flex flex-col items-center justify-center flex-shrink-0"
            >
              <div className="w-20 h-20 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-full h-full object-contain grayscale hover:grayscale-0 transition"
                />
              </div>
              <p className="mt-2 text-green-700 dark:text-green-400 font-semibold text-sm">
                {brand.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
