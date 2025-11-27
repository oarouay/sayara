interface OfferCardProps {
  title: string
  price: string
  description: string
}

export default function OfferCard({ title, price, description }: OfferCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-purple-600 font-semibold mb-2">{price}</p>
      <p className="text-gray-700">{description}</p>
      <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">
        Rent Now
      </button>
    </div>
  )
}