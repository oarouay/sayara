export default function PromoBanner() {
  return (
    <section
      className="text-center py-16 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1502877338535-766e1452684a')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Softer overlay */}
      <div className="absolute inset-0 bg-green-100/40"></div>

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-5xl font-extrabold text-green-700 mb-4">BLACK FRIDAY</h1>
        <p className="text-lg text-green-800 mb-2">Deals end in 6 days</p>
        <p className="text-md text-green-700 font-semibold">Hit the road with up to 25% off car rental</p>
        <p className="text-sm text-green-600 mt-2">Book until 3 Dec 2025, drive until the end of 2026</p>
      </div>
    </section>
  )
}