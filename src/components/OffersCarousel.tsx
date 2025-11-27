"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Navigation, Pagination, Autoplay } from "swiper/modules"

interface Offer {
  title: string
  price: string
  image: string
}

const offers: Offer[] = [
  { title: "Economy Car", price: "$25/day", image: "sayara\src\data\economy.png" },
  { title: "SUV Adventure", price: "$45/day", image: "sayara\src\data\suv.jpeg" },
  { title: "Luxury Sedan", price: "$70/day", image: "sayara\src\data\luxury.jpeg" },
]

export default function OffersCarousel() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        className="rounded-lg shadow-lg"
      >
        {offers.map((offer, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative bg-white rounded-lg overflow-hidden">
              <img src={offer.image} alt={offer.title} className="w-full h-64 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                <h3 className="text-xl font-bold">{offer.title}</h3>
                <p className="text-lg">{offer.price}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}