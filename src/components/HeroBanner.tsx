export default function PromoBanner() {
  return (
    <section
      className="relative h-[380px] md:h-[450px] flex items-center justify-center text-center overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1502877338535-766e1452684a')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark gradient overlay */}
<div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/20"></div>

{/* Content box */}
<div className="relative z-10 px-6 py-8 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl max-w-2xl mx-auto">
  
  <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-md">
    BLACK FRIDAY
  </h1>

  <p className="text-lg md:text-xl text-white font-medium mt-3">
    Deals end in 6 days
  </p>

  <p className="text-md md:text-lg text-white font-semibold mt-1">
    Hit the road with up to <span className="text-green-100">25% off</span> car rental
  </p>

  <p className="text-sm text-white mt-3">
    Book until 3 Dec 2025 — Drive until the end of 2026
  </p>

        {/* CTA Button */}
        <div className="mt-6">
          <a
            href="/car-deals"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all duration-300 hover:scale-105"
          >
            Search Deals
          </a>
        </div>

      </div>
    </section>
  );
}
