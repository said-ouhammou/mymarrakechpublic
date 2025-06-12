import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import Listing from "../../components/custom/listings/Listing";
import { FBLoading } from "@/components/custom/Loading";
import NoListingFound from "@/pages/listings/NoListingFound";
import { ActivityType } from "@/types";

interface BannerProps {
    activities: ActivityType[];
    isLoading?: boolean;
    error?: string | null;
}

export default function Banner({
    activities = [],
    isLoading = false,
    error = null,
}: BannerProps) {
    const { slug } = useParams<{ slug: string }>();
    const [filteredActivities, setFilteredActivities] = useState<
        ActivityType[]
    >([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("Voir tout");

    // Cards slider navigation states
    const cardsSliderRef = useRef<HTMLDivElement>(null);
    const [canScrollCardsLeft, setCanScrollCardsLeft] =
        useState<boolean>(false);
    const [canScrollCardsRight, setCanScrollCardsRight] =
        useState<boolean>(true);

    // Initialize filtered activities and categories when activities prop changes
    useEffect(() => {
        if (activities.length > 0) {
            setFilteredActivities(activities);

            // Extract unique categories from activities
            const uniqueCategories = Array.from(
                new Set(
                    activities.map(
                        (activity: ActivityType) => activity.category_title
                    )
                )
            ).filter(Boolean) as string[];

            setCategories(uniqueCategories);
        } else {
            setFilteredActivities([]);
            setCategories([]);
        }

        // Reset filter to "Voir tout" when activities change
        setActiveFilter("Voir tout");
    }, [activities]);

    // Check scroll position for cards slider
    const checkCardsScrollPosition = () => {
        if (cardsSliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } =
                cardsSliderRef.current;
            setCanScrollCardsLeft(scrollLeft > 0);
            setCanScrollCardsRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    // Reset cards scroll position when filter changes
    useEffect(() => {
        if (cardsSliderRef.current) {
            cardsSliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
        // Small delay to allow DOM update, then check scroll position
        setTimeout(checkCardsScrollPosition, 100);
    }, [filteredActivities]);

    // Cards slider navigation functions
    const scrollCardsLeft = () => {
        if (cardsSliderRef.current) {
            const cardWidth = 320; // Approximate card width + gap
            cardsSliderRef.current.scrollBy({
                left: -cardWidth * 2, // Scroll by 2 cards
                behavior: "smooth",
            });
        }
    };

    const scrollCardsRight = () => {
        if (cardsSliderRef.current) {
            const cardWidth = 320; // Approximate card width + gap
            cardsSliderRef.current.scrollBy({
                left: cardWidth * 2, // Scroll by 2 cards
                behavior: "smooth",
            });
        }
    };

    // Filter activities based on selected category
    const handleFilterChange = (filterCategory: string) => {
        setActiveFilter(filterCategory);

        if (filterCategory === "Voir tout") {
            setFilteredActivities(activities);
        } else {
            const filtered = activities.filter(
                (activity) => activity.category_title === filterCategory
            );
            setFilteredActivities(filtered);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return <FBLoading />;
        }

        if (error || filteredActivities.length === 0) {
            return <NoListingFound />;
        }

        return (
            <div className="relative">
                {/* Cards Slider Navigation */}
                {filteredActivities.length > 3 && (
                    <>
                        {/* Left Arrow for Cards */}
                        <button
                            onClick={scrollCardsLeft}
                            disabled={!canScrollCardsLeft}
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-300 bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                                canScrollCardsLeft
                                    ? "hover:bg-gray-50 text-gray-700 hover:shadow-xl hover:scale-105"
                                    : "text-gray-300 cursor-not-allowed opacity-50"
                            }`}
                            aria-label="Scroll cards left"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polyline points="15,18 9,12 15,6"></polyline>
                            </svg>
                        </button>

                        {/* Right Arrow for Cards */}
                        <button
                            onClick={scrollCardsRight}
                            disabled={!canScrollCardsRight}
                            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-300 bg-white shadow-lg flex items-center justify-center transition-all duration-200 ${
                                canScrollCardsRight
                                    ? "hover:bg-gray-50 text-gray-700 hover:shadow-xl hover:scale-105"
                                    : "text-gray-300 cursor-not-allowed opacity-50"
                            }`}
                            aria-label="Scroll cards right"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polyline points="9,18 15,12 9,6"></polyline>
                            </svg>
                        </button>
                    </>
                )}

                {/* Cards Slider Container */}
                <div
                    ref={cardsSliderRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
                    onScroll={checkCardsScrollPosition}
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        // WebkitScrollbar: { display: "none" },
                    }}
                >
                    {filteredActivities.map((activity) => (
                        <Listing
                            key={
                                activity.id ||
                                `activity-${activity.title}-${Math.random()}`
                            }
                            className="group flex-shrink-0 w-72"
                            activity={activity}
                            slug={slug || ""}
                            resourceType="ban"
                        />
                    ))}
                </div>

                {/* Fade effects for cards slider */}
                {/* {filteredActivities.length > 3 && (
                    <>
                        <div
                            className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-200 z-10 ${
                                canScrollCardsLeft ? "opacity-100" : "opacity-0"
                            }`}
                        ></div>
                        <div
                            className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none transition-opacity duration-200 z-10 ${
                                canScrollCardsRight
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                        ></div>
                    </>
                )} */}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="">
                {/* Category Filter Buttons */}
                <div className="flex flex-nowrap overflow-auto gap-3 mb-3 hide-scrollbar">
                    {/* "Voir tout" button */}
                    <button
                        onClick={() => handleFilterChange("Voir tout")}
                        className={`px-4 py-2 min-w-fit border border-gray-300 rounded-full transition-colors ${
                            activeFilter === "Voir tout"
                                ? "bg-[#f9f4f0] text-amber-900 hover:bg-amber-100"
                                : "bg-white hover:bg-gray-50"
                        }`}
                    >
                        Voir tout ({activities.length})
                    </button>

                    {/* Dynamic category buttons */}
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleFilterChange(category)}
                            className={`px-4 py-2 min-w-fit border border-gray-300 rounded-full transition-colors ${
                                activeFilter === category
                                    ? "bg-amber-50 text-amber-900 hover:bg-amber-100"
                                    : "bg-white hover:bg-gray-50"
                            }`}
                        >
                            {category} (
                            {
                                activities.filter(
                                    (a) => a.category_title === category
                                ).length
                            }
                            )
                        </button>
                    ))}
                </div>

                {/* Display current filter info */}
                <div className="mb-2">
                    <p className="text-sm text-gray-600">
                        {activeFilter === "Voir tout"
                            ? `Affichage de ${filteredActivities.length} activités`
                            : `Affichage de ${filteredActivities.length} activités dans "${activeFilter}"`}
                    </p>
                </div>
            </div>

            {renderContent()}
        </div>
    );
}
