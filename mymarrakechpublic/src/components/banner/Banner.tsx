import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import Listing from "../../components/custom/listings/Listing";
import { FBLoading } from "@/components/custom/Loading";
import NoListingFound from "@/pages/listings/NoListingFound";
import { ActivityType } from "@/types";

interface Category {
    title: string;
    subCategories: string[];
}

interface BannerProps {
    title: string;
    description: string;
    activities: ActivityType[];
    isLoading?: boolean;
    error?: string | null;
}

export default function Banner({
    title,
    description,
    activities = [],
    isLoading = false,
    error = null,
}: BannerProps) {
    const { slug } = useParams<{ slug: string }>();
    const [filteredActivities, setFilteredActivities] = useState<
        ActivityType[]
    >([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeFilter, setActiveFilter] = useState<{
        mainCategory: string;
        subCategory: string | null;
    }>({ mainCategory: "Voir tout", subCategory: null });

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

            // Organize categories and subcategories
            const categoriesMap = new Map<string, Set<string>>();

            activities.forEach((activity: ActivityType) => {
                if (!activity.category_title) return;

                if (!categoriesMap.has(activity.category_title)) {
                    categoriesMap.set(activity.category_title, new Set());
                }

                if (activity.sub_category_title) {
                    categoriesMap
                        .get(activity.category_title)
                        ?.add(activity.sub_category_title);
                }
            });

            const organizedCategories: Category[] = Array.from(
                categoriesMap.entries()
            ).map(([title, subCategoriesSet]) => ({
                title,
                subCategories: Array.from(subCategoriesSet),
            }));

            setCategories(organizedCategories);
        } else {
            setFilteredActivities([]);
            setCategories([]);
        }

        // Reset filter to "Voir tout" when activities change
        setActiveFilter({ mainCategory: "Voir tout", subCategory: null });
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

    const handleMainCategoryClick = (mainCategory: string) => {
        setActiveFilter({ mainCategory, subCategory: null });

        if (mainCategory === "Voir tout") {
            setFilteredActivities(activities);
        } else {
            const filtered = activities.filter(
                (activity) => activity.category_title === mainCategory
            );
            setFilteredActivities(filtered);
        }
    };

    const handleSubCategoryClick = (
        mainCategory: string,
        subCategory: string
    ) => {
        setActiveFilter({ mainCategory, subCategory });

        const filtered = activities.filter(
            (activity) =>
                activity.category_title === mainCategory &&
                activity.sub_category_title === subCategory
        );
        setFilteredActivities(filtered);
    };

    const getActivityCount = (mainCategory: string, subCategory?: string) => {
        if (!mainCategory || mainCategory === "Voir tout") {
            return activities.length;
        }

        if (subCategory) {
            return activities.filter(
                (a) =>
                    a.category_title === mainCategory &&
                    a.sub_category_title === subCategory
            ).length;
        }

        return activities.filter((a) => a.category_title === mainCategory)
            .length;
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
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="">
                <section className="mb-4 max-w-5xl">
                    <h1 className="text-xl tracking-tight font-semibold text-gray-800 mt-4 mb-2">
                        {title}
                    </h1>
                    <p className="text-gray-700 text-md tracking-tight">
                        {description}
                    </p>
                </section>

                {/* Main Category Filter Buttons */}
                <div className="flex flex-nowrap overflow-auto gap-3 mb-2 hide-scrollbar">
                    {/* "Voir tout" button */}
                    <button
                        onClick={() => handleMainCategoryClick("Voir tout")}
                        className={`px-4 py-2 min-w-fit border border-gray-300 rounded-full transition-colors ${
                            activeFilter.mainCategory === "Voir tout"
                                ? "bg-[#f9f4f0] text-amber-900 hover:bg-amber-100"
                                : "bg-white hover:bg-gray-50"
                        }`}
                    >
                        Voir tout ({activities.length})
                    </button>

                    {/* Dynamic main category buttons */}
                    {categories.map((category) => (
                        <button
                            key={category.title}
                            onClick={() =>
                                handleMainCategoryClick(category.title)
                            }
                            className={`px-4 py-2 min-w-fit border border-gray-300 rounded-full transition-colors ${
                                activeFilter.mainCategory === category.title &&
                                !activeFilter.subCategory
                                    ? "bg-amber-50 text-amber-900 hover:bg-amber-100"
                                    : "bg-white hover:bg-gray-50"
                            }`}
                        >
                            {category.title} ({getActivityCount(category.title)}
                            )
                        </button>
                    ))}
                </div>

                {/* Subcategory filter row (only shown when a main category is selected) */}
                {activeFilter.mainCategory !== "Voir tout" && (
                    <div className="flex flex-nowrap overflow-auto gap-3 mb-2 hide-scrollbar">
                        {categories
                            .find((c) => c.title === activeFilter.mainCategory)
                            ?.subCategories.map((subCategory) => (
                                <button
                                    key={subCategory}
                                    onClick={() =>
                                        handleSubCategoryClick(
                                            activeFilter.mainCategory,
                                            subCategory
                                        )
                                    }
                                    className={`px-4 py-2 min-w-fit border border-gray-300 rounded-full transition-colors ${
                                        activeFilter.subCategory === subCategory
                                            ? "bg-amber-50 text-amber-900 hover:bg-amber-100"
                                            : "bg-white hover:bg-gray-50"
                                    }`}
                                >
                                    {subCategory} (
                                    {getActivityCount(
                                        activeFilter.mainCategory,
                                        subCategory
                                    )}
                                    )
                                </button>
                            ))}
                    </div>
                )}

                {/* Display current filter info */}
                <div className="mb-2">
                    <p className="text-sm text-gray-600">
                        {activeFilter.mainCategory === "Voir tout"
                            ? `Affichage de ${filteredActivities.length} activités`
                            : activeFilter.subCategory
                            ? `Affichage de ${filteredActivities.length} activités dans "${activeFilter.mainCategory} > ${activeFilter.subCategory}"`
                            : `Affichage de ${filteredActivities.length} activités dans "${activeFilter.mainCategory}"`}
                    </p>
                </div>
            </div>

            {renderContent()}
        </div>
    );
}
