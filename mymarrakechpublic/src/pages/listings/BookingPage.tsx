
// import { useEffect, useState } from "react"
// import { z } from "zod"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Input } from "@/components/ui/input"
// import { Info, MapPin } from "lucide-react"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
// import { useParams } from "react-router"
// import axiosInstance from "@/axios/axiosInstance"
// import PaymentMethods from "@/components/custom/booking/PaymentMethods"
// import Schedules from "@/components/custom/booking/Schedules"
// import { ActivityType, PageType } from "@/types"
// import NoListingFound from "./NoListingFound"

// const formSchema = z.object({
//   firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
//   lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
//   adults: z.string().min(1, "Veuillez sélectionner le nombre d'adultes"),
//   children: z.string(),
//   withTransfer: z.boolean().default(false).optional(),
//   phone: z.string().min(8, "Numéro de téléphone invalide"),
//   email: z.string().email("Adresse email invalide"),
//   date: z.string().min(1, "Veuillez sélectionner une date"), // ISO date string
// })


// type FormValues = z.infer<typeof formSchema> & {
//   activity_id?: string;
//   supplier_id?: string;
//   category_id?: string;
//   category_title?: string;
//   activity_title?: string;
//   source?: string;
//   source_id?: string;
//   base_url?: string;
//   total_price?: number; 
// };

// export default function BookingPage() {
//   const { slug, id } = useParams<{ slug: string; id: string }>() // Get the route params
//   const [page, setPage] = useState<PageType>()
//   const [activity, setActivity] = useState<ActivityType>()
//   const [totalPrice, setTotalPrice] = useState(0)
  


//   // Fetch page and activity data based on slug and id
//   useEffect(() => {
//     const fetchPageData = async () => {
//       try {
//         const response = await axiosInstance.get(`/${slug}/${id}`)
//         const data = response.data

//         if (data.page && data.activity) {
//           setPage(()=>data.page)
//           setActivity(()=>data.activity)
//           setTotalPrice(data.activity.prices[0]?.price || 0) 
//         } else {
//           console.error("Page or Activity not found")
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error)
//       }

//       console.log("Fetched page data:", page)
//       console.log("Fetched activity data:", activity)
//     }

//     fetchPageData()
//   }, [slug, id]);

//   // if (!activity) {
//   //   throw new Error("Activity not found");
//   // }

//   // Initialize the form
//   const form = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       adults: "1",
//       children: "0",
//       withTransfer: false,
//       phone: "",
//       email: "",
//     },
//   })

//   // Get the selected day to determine available times
//   const selectedAdults = Number.parseInt(form.watch("adults") || "1")
//   const selectedChildren = Number.parseInt(form.watch("children") || "0")
//   // const withTransfer = form.watch("withTransfer")

//   // Update total price when adults or children change
//   useState(() => {
//     const adultPrice = (activity?.prices[0]?.price ?? 0) * selectedAdults
//     const childPrice = (activity?.prices?.[1]?.price ?? 0) * selectedChildren // Ensure prices is an array and handle undefined
//     // const transferFee = withTransfer ? 50 : 0 // Additional transfer fee
//     // setTotalPrice(adultPrice + childPrice + transferFee)
//     setTotalPrice(adultPrice + childPrice)
//   })

//   // Handle form submission
//   const onSubmit = (data: FormValues) => {
//     data['activity_id'] = activity?.id ? String(activity.id) : undefined;
//     data['supplier_id'] = activity?.supplier_id ? String(activity.supplier_id) : undefined;
//     data['category_id'] = activity?.category_id ? String(activity.category_id) : undefined;
//     data['activity_title'] = activity?.title;
//     data['category_title'] = activity?.category_title;
//     data['total_price'] = totalPrice;
//     data['source'] = page?.slug;
//     data['source_id'] = page?.id ? String(page.id) : undefined;
//     data['base_url'] = page?.base_url ? String(page?.base_url) : undefined;

//     console.log("Form submitted:", data)
//     // Here you would typically send the data to your backend
//     alert(
//       `Réservation confirmée pour ${data.firstName} ${data.lastName}\n` +
//       `${data.adults} adulte(s) et ${data.children} enfant(s)\n` +
//       `Le ${data.date}\n` +
//       `${data.withTransfer ? 'Avec transfert' : 'Sans transfert'}\n` +
//       `Contact: ${data.phone} / ${data.email}`
//     )
    
//   }



//   return (
//     <>
//       <div className="max-w-7xl mx-auto p-4 md:p-6">
//       { activity ? (<>
//         <h1 className="text-3xl font-bold mb-6">{activity?.title}</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left column - Activity details */}
//           <div className="lg:col-span-2">
//             <div className="relative aspect-[16/9] mb-6">
//               <img
//                 src={activity?.image ? activity?.image : "/placeholder.svg"}
//                 alt={activity?.title}
                
//                 className="object-cover rounded-lg"
//               />
//             </div>

//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Description</h2>
//               <p className="mb-4 text-gray-700">
//               {activity?.description}
//               </p>
//             </div>

//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Horaires disponibles</h2>
//               <div className="space-y-2 text-gray-700">
//                   <Schedules schedulesProp={activity?.schedules}/>
//               </div>
//             </div>

//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Moyens de paiement acceptés</h2>
//               <div className="space-y-2 text-gray-700">
//                 <PaymentMethods paymentMethodsProp={activity?.payment_methods || []} />
//               </div>
//             </div>

//             <div className="mb-8">
//               <h2 className="text-xl font-semibold mb-4">Localisation</h2>
//               <div className="flex items-center gap-2 text-gray-700">
//                 <MapPin size={18} className="text-[#0a8a8a]" />
//                 <a href={activity?.localisation} target="_blank" >{activity?.localisation}</a>
//               </div>
//             </div>
//           </div>

//           {/* Right column - Updated Booking form */}
//           <div>
//             <Card className="sticky top-4">
//               <CardContent className="pt-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="text-2xl font-bold">{activity?.prices[0]?.price} EUR</div>
//                   <div className="text-sm text-gray-500">par adulte</div>
//                 </div>

//                 <Separator className="mb-6" />

//                 <Form {...form}>
//                   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                     {/* Personal Information */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="firstName"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Prénom</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Prénom" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="lastName"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Nom</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Nom" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     {/* Contact Information */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="phone"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Téléphone</FormLabel>
//                             <FormControl>
//                               <Input placeholder="+212 600 000000" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="email"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Email</FormLabel>
//                             <FormControl>
//                               <Input placeholder="exemple@email.com" {...field} />
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     <FormField
//                       control={form.control}
//                       name="date"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Date de l'activité</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="date"
//                               {...field}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

                    

//                     {/* Number of People */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <FormField
//                         control={form.control}
//                         name="adults"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Adultes</FormLabel>
//                             <Select
//                               onValueChange={(value) => {
//                                 field.onChange(value)
//                                 const adultPrice = (activity?.prices[0]?.price ?? 0) * Number.parseInt(value)
//                                 const childPrice = (activity?.prices[1]?.price ?? 0) * selectedChildren
//                                 // const transferFee = withTransfer ? 50 : 0
//                                 // setTotalPrice(adultPrice + childPrice + transferFee)
//                                 setTotalPrice(adultPrice + childPrice)
//                               }}
//                               defaultValue={field.value}
//                             >
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Adultes" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
//                                   <SelectItem key={num} value={num.toString()}>
//                                     {num}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />

//                       <FormField
//                         control={form.control}
//                         name="children"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Enfants</FormLabel>
//                             <Select
//                               onValueChange={(value) => {
//                                 field.onChange(value)
//                                 const adultPrice = (activity?.prices?.[0]?.price ?? 0) * selectedAdults
//                                 const childPrice = (activity?.prices?.[1]?.price ?? 0) * Number.parseInt(value)
//                                 // const transferFee = withTransfer ? 50 : 0
//                                 // setTotalPrice(adultPrice + childPrice + transferFee)
//                                 setTotalPrice(adultPrice + childPrice)
//                               }}
//                               defaultValue={field.value}
//                             >
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Enfants" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
//                                   <SelectItem key={num} value={num.toString()}>
//                                     {num}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
//                     </div>

//                     {/* Transfer Option */}
//                     <FormField
//                       control={form.control}
//                       name="withTransfer"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                           <FormControl>
//                             <Checkbox
//                               checked={field.value}
//                               onCheckedChange={(checked) => {
//                                 field.onChange(checked)
//                                 const adultPrice = (activity?.prices?.[0]?.price ?? 0) * selectedAdults
//                                 const childPrice = (activity?.prices?.[1]?.price ?? 0) * selectedChildren
//                                 // const transferFee = checked ? 50 : 0
//                                 // setTotalPrice(adultPrice + childPrice + transferFee)
//                                 setTotalPrice(adultPrice + childPrice)
//                               }}
//                             />
//                           </FormControl>
//                           <div className="space-y-1 leading-none">
//                             <FormLabel>
//                               Ajouter le transfert
//                             </FormLabel>
//                             <FormDescription>
//                               Service de transport depuis votre hébergement
//                             </FormDescription>
//                           </div>
//                         </FormItem>
//                       )}
//                     />

//                     <Separator />

//                     <div className="flex items-center justify-between font-semibold">
//                       <span>Total</span>
//                       <span>{totalPrice} EUR</span>
//                     </div>

//                     <Button type="submit" className="w-full bg-[#0a8a8a] hover:bg-[#0a8a8a]/90">
//                       Réserver maintenant
//                     </Button>

//                     <div className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
//                       <Info size={12} />
//                       <span>Annulation gratuite jusqu'à 48h avant l'activité</span>
//                     </div>
//                   </form>
//                 </Form>
//               </CardContent>
//             </Card>
//           </div>
//         </div> </>) : (<NoListingFound/>)
//         }
//       </div>
//     </>
//   )
// }


// ____________________________________________________________________________________________


import { useEffect, useState, useMemo } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Info, MapPin } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import axiosInstance from "@/axios/axiosInstance"
import PaymentMethods from "@/components/custom/booking/PaymentMethods"
import Schedules from "@/components/custom/booking/Schedules"
import { ActivityType, PageType } from "@/types"
import NoListingFound from "./NoListingFound"
import { toast } from "sonner"

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  adults: z.string().min(1, "Veuillez sélectionner le nombre d'adultes"),
  children: z.string(),
  withTransfer: z.boolean().default(false).optional(),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email("Adresse email invalide"),
  date: z.string().min(1, "Veuillez sélectionner une date"),
})

// Type for form values including additional booking data
type FormValues = z.infer<typeof formSchema> & {
  activity_id?: string;
  supplier_id?: string;
  category_id?: string;
  category_title?: string;
  activity_title?: string;
  source?: string;
  source_id?: string;
  base_url?: string;
  total_price?: number; 
};

export default function BookingPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>()
  const navigate = useNavigate();
  const [page, setPage] = useState<PageType>()
  const [activity, setActivity] = useState<ActivityType>()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      adults: "1",
      children: "0",
      withTransfer: false,
      phone: "",
      email: "",
      date: "",
    },
  })

  // Watch form values
  const selectedAdults = parseInt(form.watch("adults") || "1", 10)
  const selectedChildren = parseInt(form.watch("children") || "0", 10)
  const withTransfer = form.watch("withTransfer")

  // Calculate total price based on selections
  const totalPrice = useMemo(() => {
    if (!activity?.prices) return 0;
    
    const adultPrice = (activity.prices[0]?.price || 0) * selectedAdults;
    const childPrice = (activity.prices[1]?.price || 0) * selectedChildren;
    // If transfer pricing is implemented in the future:
    // const transferFee = withTransfer ? 50 : 0;
    // return adultPrice + childPrice + transferFee;
    
    return adultPrice + childPrice;
  }, [activity, selectedAdults, selectedChildren, withTransfer]);

  // Fetch page and activity data
  useEffect(() => {
    const fetchPageData = async () => {
      if (!slug || !id) return;
      
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/${slug}/${id}`);
        const data = response.data;

        if (data.page && data.activity) {
          setPage(data.page);
          setActivity(data.activity);
        } else {
          setError("Activité ou page non trouvée");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        setError("Erreur lors du chargement de l'activité");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [slug, id]);

  // // Form submission handler
  // const onSubmit = (data: FormValues) => {
  //   // Enrich form data with activity details
  //   const bookingData = {
  //     ...data,
  //     activity_id: activity?.id?.toString(),
  //     supplier_id: activity?.supplier_id?.toString(),
  //     category_id: activity?.category_id?.toString(),
  //     activity_title: activity?.title,
  //     category_title: activity?.category_title,
  //     total_price: totalPrice,
  //     source: page?.slug,
  //     source_id: page?.id?.toString(),
  //     base_url: page?.base_url,
  //   };

  //   console.log("Réservation soumise:", bookingData);
    
  //   // Here you would send the data to your backend
  //   alert(
  //     `Réservation confirmée pour ${data.firstName} ${data.lastName}\n` +
  //     `${data.adults} adulte(s) et ${data.children} enfant(s)\n` +
  //     `Le ${data.date}\n` +
  //     `${data.withTransfer ? 'Avec transfert' : 'Sans transfert'}\n` +
  //     `Contact: ${data.phone} / ${data.email}`
  //   );
  // };

  // fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff

  // Helper function to handle API requests for booking
const submitBooking = async (bookingData: FormValues) => {
  try {
    const response = await axiosInstance.post("/bookings", bookingData);
    return response.data;
  } catch (error: unknown) {
    // Log and return an error response
    if (error instanceof Error) {
      // If error has response data, log it
      if ((error as any)?.response?.data) {
        console.error("API Error during booking submission:", (error as any).response.data);
      } else {
        console.error("API Error during booking submission:", error.message);
      }
    } else {
      console.error("Unknown error occurred during booking submission:", error);
    }
    throw error; // Re-throwing so it can be handled where the function is called
  }
};

// Form submission handler
    const onSubmit = async (data: FormValues) => {
      // Enriching form data with activity and page details
      const bookingData = {
        ...data,
        activity_id: activity?.id?.toString(),
        supplier_id: activity?.supplier_id?.toString(),
        category_id: activity?.category_id?.toString(),
        activity_title: activity?.title,
        category_title: activity?.category_title,
        total_price: totalPrice,
        source: page?.slug,
        source_id: page?.id?.toString(),
        base_url: page?.base_url,
      };

      try {
        const response = await submitBooking(bookingData);
        if(response.status === 200) {
          toast.success("Réservation soumise avec succès !");
          form.reset();
          toast.success("Réservation soumise avec succès !");
          navigate(`/${page?.slug}`);
        }

      } catch (error) {
        console.error("Booking failed");
      }
    };



  // Helper function to create number options for selects
  const renderNumberOptions = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => i + start).map((num) => (
      <SelectItem key={num} value={num.toString()}>
        {num}
      </SelectItem>
    ));
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Chargement en cours...</div>;
  }

  if (error || !activity) {
    return <NoListingFound />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <a
        href={`/${page?.slug}`}
        className="text-sm text-gray-800 block py-1 mb-2 font-semibold hover:underline"
      >
        <ArrowLeft size={16} className="inline mr-1" />
        Retour à la page principale
      </a>


      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold mb-6 capitalize">{activity.title}</h1>
        <span className="text-gray-700 text-md tracking-tight font-semibold">- {activity.category_title} </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Activity details */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/9] mb-6">
            <img
              src={activity.image || "/placeholder.svg"}
              alt={activity.title}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>

          <section aria-labelledby="description-heading" className="mb-8">
            <h2 id="description-heading" className="text-xl font-semibold mb-4">Description</h2>
            <p className="mb-4 text-gray-700">{activity.description}</p>
          </section>

          <section aria-labelledby="schedules-heading" className="mb-8">
            <h2 id="schedules-heading" className="text-xl font-semibold mb-4">Horaires disponibles</h2>
            <Schedules schedulesProp={activity.schedules} />
          </section>

          <section aria-labelledby="payment-heading" className="mb-8">
            <h2 id="payment-heading" className="text-xl font-semibold mb-4">Moyens de paiement acceptés</h2>
            <PaymentMethods paymentMethodsProp={activity.payment_methods || []} />
          </section>

          <section aria-labelledby="location-heading" className="mb-8">
            <h2 id="location-heading" className="text-xl font-semibold mb-4">Localisation</h2>
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin size={18} className="text-[#0a8a8a]" />
              <a 
                href={activity.localisation} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {activity.localisation}
              </a>
            </div>
          </section>
        </div>

        {/* Right column - Booking form */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="text-2xl font-bold">{activity.prices?.[0]?.price} EUR</div>
                <div className="text-sm text-gray-500">par adulte</div>
              </div>

              <Separator className="mb-6" />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+212 600 000000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="exemple@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date de l'activité</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Number of People */}
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="adults"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adultes</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Adultes" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {renderNumberOptions(1, 10)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="children"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enfants</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Enfants" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {renderNumberOptions(0, 10)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Transfer Option */}
                  <FormField
                    control={form.control}
                    name="withTransfer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Ajouter le transfert
                          </FormLabel>
                          <FormDescription>
                            Service de transport depuis votre hébergement
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Separator />

                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>{totalPrice} EUR</span>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#0a8a8a] hover:bg-[#0a8a8a]/90 cursor-pointer"
                  >
                    Réserver maintenant
                  </Button>

                  <div className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                    <Info size={12} />
                    <span>Annulation gratuite jusqu'à 48h avant l'activité</span>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}