import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Listing from "../../components/custom/listings/Listing";
import { FBLoading } from "@/components/custom/Loading";
import NoListingFound from "./NoListingFound";
import axiosInstance from "@/axios/axiosInstance";
import { ActivityType, SupplierType, BannerMetaData } from "@/types";
import Banner from "@/components/banner/Banner";

interface Category {
    title: string;
    subCategories: string[];
}

export default function ListingsPage() {
    const { slug } = useParams<{ slug: string }>();
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [supplier, setSupplier] = useState<SupplierType | null>(null);
    const [bannerMetaData, setBannerMetaData] = useState<BannerMetaData>({
        title: "",
        description: "",
    });
    const [bannerActivities, setBannerActivities] = useState<ActivityType[]>(
        []
    );
    const [filteredActivities, setFilteredActivities] = useState<
        ActivityType[]
    >([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeFilter, setActiveFilter] = useState<{
        mainCategory: string;
        subCategory: string | null;
    }>({ mainCategory: "Voir tout", subCategory: null });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            if (!slug) return;

            setIsLoading(true);

            try {
                const response = await axiosInstance.get(`/${slug}`);

                if (response.data) {
                    const activitiesData = response.data.activities || [];
                    const bannerActivitiesData =
                        response.data.bannerActivities || [];
                    setActivities(activitiesData);
                    setSupplier(response.data.supplier || null);
                    setBannerActivities(bannerActivitiesData);
                    setFilteredActivities(activitiesData);
                    setBannerMetaData(() => response.data.bannerMetaData);

                    // Organize categories and subcategories
                    const categoriesMap = new Map<string, Set<string>>();

                    activitiesData.forEach((activity: ActivityType) => {
                        if (!activity.category_title) return;

                        if (!categoriesMap.has(activity.category_title)) {
                            categoriesMap.set(
                                activity.category_title,
                                new Set()
                            );
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
                    setError("Aucune donnée trouvée");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des activités");
                setError(
                    "Une erreur s'est produite lors du chargement des activités"
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivities();
    }, [slug]);

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

    const renderContent = () => {
        if (isLoading) {
            return <FBLoading />;
        }

        if (error || filteredActivities.length === 0) {
            return <NoListingFound />;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {filteredActivities.map((activity) => (
                    <Listing
                        key={
                            activity.id ||
                            `activity-${activity.title}-${Math.random()}`
                        }
                        activity={activity}
                        slug={slug || ""}
                        resourceType="qr"
                    />
                ))}
            </div>
        );
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

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <section className="mb-12 max-w-5xl px-4">
                {supplier && (
                    <h1 className="text-2xl tracking-tight font-semibold text-gray-800 my-4">
                        Partenaire de {supplier.company}
                    </h1>
                )}
                <p className="text-gray-700 text-md tracking-tight">
                    Ce partenaire collabore avec l'agence My Marrakech.
                    Ensemble, nous vous proposons des expériences authentiques.
                    Excursions dans le désert, balades à dos de chameau, cours
                    de cuisine… Des activités sur-mesure pour découvrir
                    Marrakech autrement.
                </p>
            </section>

            {bannerActivities && bannerActivities.length > 0 && (
                <Banner
                    title={bannerMetaData.title}
                    description={bannerMetaData.description}
                    activities={bannerActivities}
                    error={error}
                    isLoading={isLoading}
                />
            )}

            <div className="px-4">
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

                    {/* Main category buttons */}
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
                <div className="mb-4">
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
