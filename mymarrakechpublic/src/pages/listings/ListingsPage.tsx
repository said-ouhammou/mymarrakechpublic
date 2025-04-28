
// import Listing from "../../components/custom/listings/Listing"
// import { useParams } from "react-router"
// import { useEffect, useState } from "react"
// import axiosInstance from "@/axios/axiosInstance"
// import { ActivityType } from "@/types";
// import { FBLoading } from "@/components/custom/Loading";
// import NoListingFound from "./NoListingFound";


// export default function ListingsPage() {

//   const { slug } = useParams<string>()
//   const [activities, setActivities] = useState<ActivityType[] | []>([])
//   const [page,setPage] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(true)

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const response = await axiosInstance.get(`/${slug}`)
//         setActivities(response.data.activities || [])
//         setPage(response.data.page.slug || "")
//       } catch (error) {
//         console.error("Error fetching activities:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchActivities()
//   }, [slug])

//   return (
//     <>
//       <div className="max-w-7xl mx-auto px-4 py-8">
        
//         <div className="mb-12 max-w-5xl">
//             <h1 className="text-2xl tracking-tight font-semibold text-gray-800 my-4">Partenaires de My Marrakech</h1>
//             <p className="text-gray-700 text-md tracking-tight">
//             Ce partenaire collabore avec l’agence My Marrakech.
//             Ensemble, nous vous proposons des expériences authentiques.
//             Excursions dans le désert, balades à dos de chameau, cours de cuisine…
//             Des activités sur-mesure pour découvrir Marrakech autrement.
//             </p>
          
//         </div>

//         {/* Filter Buttons */}
//         {/* <div className="flex flex-nowrap overflow-auto gap-3 mb-10">
//           <button className="px-4 py-2 min-w-fit border border-gray-300 rounded-full bg-amber-50 text-amber-900 hover:bg-amber-100">
//             Voir tout
//           </button>
//           <button className="px-4 py-2 min-w-fit border border-gray-300 rounded-full bg-white hover:bg-gray-50">
//             Dans les airs
//           </button>
//           <button className="px-4 py-2 min-w-fit border border-gray-300 rounded-full bg-white hover:bg-gray-50">Découverte</button>
//           <button className="px-4 py-2 min-w-fit border border-gray-300 rounded-full bg-white hover:bg-gray-50">Nautiques</button>
//           <button className="px-4 py-2 min-w-fit border border-gray-300 rounded-full bg-white hover:bg-gray-50">Terrestres</button>
//         </div> */}

//         {/* Activities Grid */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {
//             activities.map((activity, index) => (
//               <ActivityCard
//                 key={index}
//                 activity={activity}
//           />
//             ))
              
//           }
//         </div> */}
//         {/* ---------------------------- */}
//         {loading ? (
//           <FBLoading/>
//         ) : activities.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {activities.map((activity, index) => (
//                   <Listing key={index} activity={activity} slug={page} />
//               ))}
//             </div>
//         ) : (
//           <NoListingFound/>
//         )}
//       </div>
//     </>
//   )
// }



// ____________________________________________________________________________________________

import { useEffect, useState } from "react"
import { useParams } from "react-router"
import Listing from "../../components/custom/listings/Listing"
import { FBLoading } from "@/components/custom/Loading"
import NoListingFound from "./NoListingFound"
import axiosInstance from "@/axios/axiosInstance"
import { ActivityType, PageType } from "@/types"

export default function ListingsPage() {
  const { slug } = useParams<{ slug: string }>()
  const [activities, setActivities] = useState<ActivityType[]>([])
  const [page, setPage] = useState<PageType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      if (!slug) return
      
      setIsLoading(true)
      
      try {
        const response = await axiosInstance.get(`/${slug}`)
        
        if (response.data) {
          setActivities(response.data.activities || [])
          setPage(response.data.page || null)
        } else {
          setError("Aucune donnée trouvée")
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des activités")
        setError("Une erreur s'est produite lors du chargement des activités")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [slug])

  const renderContent = () => {
    if (isLoading) {
      return <FBLoading />
    }

    if (error || activities.length === 0) {
      return <NoListingFound />
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {activities.map((activity) => (
          <Listing 
            key={activity.id || `activity-${activity.title}-${Math.random()}`} 
            activity={activity} 
            slug={slug || ""} 
          />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="mb-12 max-w-5xl">
        <h1 className="text-2xl tracking-tight font-semibold text-gray-800 my-4">
          Partenaires de My Marrakech
        </h1>
        <p className="text-gray-700 text-md tracking-tight">
          Ce partenaire collabore avec l'agence My Marrakech.
          Ensemble, nous vous proposons des expériences authentiques.
          Excursions dans le désert, balades à dos de chameau, cours de cuisine…
          Des activités sur-mesure pour découvrir Marrakech autrement.
        </p>
      </section>

      {/* Commented out filter buttons - preserved for future use
      <div className="flex flex-nowrap overflow-auto gap-3 mb-10">
        <button className="px-4 py-2 min-w-fit border border-gray-300 rounded-full bg-amber-50 text-amber-900 hover:bg-amber-100">
          Voir tout
        </button>
        <button className="px-4 py-2 min-w-fit border border-gray-300 rounded-full bg-white hover:bg-gray-50">
          Dans les airs
        </button>
        <button className="px-4 py-2 min-w-fit border border-gray-300 rounded-full bg-white hover:bg-gray-50">
          Découverte
        </button>
        <button className="px-4 py-2 min-w-fit border border-gray-300 rounded-full bg-white hover:bg-gray-50">
          Nautiques
        </button>
        <button className="px-4 py-2 min-w-fit border border-gray-300 rounded-full bg-white hover:bg-gray-50">
          Terrestres
        </button>
      </div>
      */}

      {renderContent()}
    </div>
  )
}