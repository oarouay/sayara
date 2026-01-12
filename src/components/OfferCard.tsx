interface OfferCardProps {
  title: string
  price: string
  description: string
}

export default function OfferCard({ title, price, description }: OfferCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2">{price}</p>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
      <button className="mt-4 w-full bg-purple-600 dark:bg-purple-700 text-white py-2 rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 transition">
        Rent Now
      </button>
    </div>
  )
}