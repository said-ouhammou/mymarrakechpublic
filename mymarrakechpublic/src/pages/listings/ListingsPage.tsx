import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Listing from "../../components/custom/listings/Listing";
import { FBLoading } from "@/components/custom/Loading";
import NoListingFound from "./NoListingFound";
import axiosInstance from "@/axios/axiosInstance";
import { ActivityType } from "@/types";

export default function ListingsPage() {
    const { slug } = useParams<{ slug: string }>();
    const [activities, setActivities] = useState<ActivityType[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<
        ActivityType[]
    >([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("Voir tout");
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
                    setActivities(activitiesData);
                    setFilteredActivities(activitiesData);

                    // Extract unique categories from activities
                    const uniqueCategories = Array.from(
                        new Set(
                            activitiesData.map(
                                (activity: ActivityType) =>
                                    activity.category_title
                            )
                        )
                    ).filter(Boolean) as string[];

                    setCategories(uniqueCategories);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredActivities.map((activity) => (
                    <Listing
                        key={
                            activity.id ||
                            `activity-${activity.title}-${Math.random()}`
                        }
                        activity={activity}
                        slug={slug || ""}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <section className="mb-12 max-w-5xl">
                <h1 className="text-2xl tracking-tight font-semibold text-gray-800 my-4">
                    Partenaires de My Marrakech
                </h1>
                <p className="text-gray-700 text-md tracking-tight">
                    Ce partenaire collabore avec l'agence My Marrakech.
                    Ensemble, nous vous proposons des expériences authentiques.
                    Excursions dans le désert, balades à dos de chameau, cours
                    de cuisine… Des activités sur-mesure pour découvrir
                    Marrakech autrement.
                </p>
            </section>

            <div className="flex flex-nowrap overflow-auto gap-3 mb-10 hide-scrollbar">
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
            <div className="mb-4">
                <p className="text-sm text-gray-600">
                    {activeFilter === "Voir tout"
                        ? `Affichage de ${filteredActivities.length} activités`
                        : `Affichage de ${filteredActivities.length} activités dans "${activeFilter}"`}
                </p>
            </div>

            {renderContent()}
        </div>
    );
}
