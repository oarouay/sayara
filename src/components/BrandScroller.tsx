export default function BrandScroller() {
  const brands = ["Toyota", "BMW", "Mercedes", "Audi", "Ford", "Kia", "Hyundai"]

  return (
    <section className="py-8 px-6">
      <h2 className="text-xl font-bold text-green-700 mb-4">Popular car hire brands</h2>
      <div className="flex gap-6 overflow-x-auto">
        {brands.map((brand, idx) => (
          <div key={idx} className="min-w-[120px] bg-white shadow rounded p-4 text-center text-green-600 font-semibold">
            {brand}
          </div>
        ))}
      </div>
    </section>
  )
}