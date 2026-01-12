// app/components/WhyChooseUs.tsx
import { ShieldCheckIcon, ClockIcon, CurrencyDollarIcon, LifebuoyIcon } from "@heroicons/react/24/outline";

export default function WhyChooseUs() {
  const features = [
    {
      title: "No Hidden Fees",
      description: "Transparent pricing with clear cost breakdown. Pay only what you see.",
      icon: ShieldCheckIcon,
    },
    {
      title: "24/7 Customer Support",
      description: "We’re here anytime you need help during your rental.",
      icon: ClockIcon,
    },
    {
      title: "Best Price Guarantee",
      description: "We offer the most competitive rates in the market.",
      icon: CurrencyDollarIcon,
    },
    {
      title: "Roadside Assistance",
      description: "Drive with peace of mind with 24/7 roadside support.",
      icon: LifebuoyIcon,
    },
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Why Choose <span className="text-green-600 dark:text-green-400">Sayara</span>?
        </h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We make car hiring easy, affordable, and reliable.
        </p>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-lg dark:shadow-gray-900/50 transition"
            >
              <feature.icon className="h-10 w-10 text-green-600 dark:text-green-400 mx-auto" />
              <h3 className="mt-4 font-semibold text-lg text-gray-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
