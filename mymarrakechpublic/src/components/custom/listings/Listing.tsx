import { MapPin } from "lucide-react";
import Price from "./Price";
import { ActivityType } from "@/types";

type ListingProps = {
  activity: ActivityType;
  slug: string;
};

export default function Listing({ activity, slug }: ListingProps) {
  const {
    id,
    title,
    image,
    description,
    category_title,
    prices
  } = activity;

  const truncateDescription = (text: string | undefined, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <a 
      href={`/${slug}/${id}`} 
      className="bg-white rounded-sm overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow group"
      aria-label={`View details for ${title}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image || "/placeholder.svg"} 
          alt={title || "Activity"} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            {category_title && (
              <div className="text-sm mb-1 bg-[#cb947e] w-fit px-2 py-1 rounded-md text-white font-medium">
                {category_title}
              </div>
            )}
            
            <h3 className="font-medium text-gray-900 text-lg tracking-[-0.8px]">
              {title}
            </h3>
          </div>
          
        </div>
 
        {description && (
          <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{truncateDescription(description)}</span>
          </div>
        )}
 
        {/* Duration placeholder - preserved for future use
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        */}
 
        {/* Original price placeholder - preserved for future use
        {activity.originalPrice && (
          <div className="text-sm text-gray-500 line-through">
            {activity.originalPrice}€ au lieu de {activity.originalPrice}€
          </div>
        )}
        */}
 
        <div className="flex justify-between items-center mt-2">
          {/* Transport included badge - preserved for future use
          {activity.transportIncluded && (
            <span className="bg-[#cb947e] text-white text-xs px-2 py-1 rounded">
              Transport inclus
            </span>
          )}
          */}
          <Price pricesProp={prices} />
        </div>
      </div>
    </a>
  );
}