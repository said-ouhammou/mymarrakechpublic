import { PriceType } from "@/types";

// Define the component props type
type PriceProps = {
  pricesProp: PriceType[]; // Accepts an array of price objects
};

export default function Price({ pricesProp }: PriceProps) {
  // Ensure that pricesProp is an array
  const prices: PriceType[] = Array.isArray(pricesProp) ? pricesProp : JSON.parse(pricesProp || '[]');

  return (
    <>
      {prices && prices.length > 0 && (
        <div className="flex flex-col gap-4">
          {/* Display Adult Prices */}
          {prices
            .filter((price) => price.person === 'adult') // Filter for adult prices
            .map((price, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                <span className="bg-[#f8f3ef] text-black px-3 py-1 text-sm rounded font-semibold">
                  {price.price} EUR
                </span>
                <span className="text-gray-400 font-semibold text-sm">Par adulte</span>
              </div>
            ))}

          {/* Display Child Prices */}
          {prices
            .filter((price) => price.person === 'enfant') // Filter for child prices
            .map((price, index) => (
                <div className="text-sm text-gray-500" key={index}>
                    <span className='text-gray-900 font-semibold'>{price.price} EUR</span> - Par enfant
                </div>
            ))}
        </div>
      )}
    </>
  );
}
