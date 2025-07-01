
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Info,Loader2  } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"

// Define the form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  day: z.string({
    required_error: "Veuillez sélectionner un jour",
  }),
  time: z.string({
    required_error: "Veuillez sélectionner un horaire",
  }),
  adults: z.string().min(1, "Veuillez sélectionner le nombre d'adultes"),
  children: z.string(),
  withTransfer: z.boolean().default(false).optional(),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  email: z.string().email("Adresse email invalide"),
})

// Define available days and times
const availableDays = [
  { value: "monday", label: "Lundi" },
  { value: "tuesday", label: "Mardi" },
  { value: "wednesday", label: "Mercredi" },
  { value: "thursday", label: "Jeudi" }
];

// Define available times for each day
const availableTimes = {
  monday: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
  tuesday: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
  wednesday: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
  thursday: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"]
}

type FormValues = z.infer<typeof formSchema>

export default function BookingForm() {
  const [totalPrice, setTotalPrice] = useState(70)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      day: "",
      time: "",
      adults: "1",
      children: "0",
      withTransfer: false,
      phone: "",
      email: "",
    },
  })

  // Get the selected day to determine available times
  const selectedDay = form.watch("day")
  const selectedAdults = Number.parseInt(form.watch("adults") || "1")
  const selectedChildren = Number.parseInt(form.watch("children") || "0")
  const withTransfer = form.watch("withTransfer")

  // Update total price when adults or children change
  useState(() => {
    const adultPrice = 70 * selectedAdults
    const childPrice = 0 * selectedChildren // Child price is 0 as per the image
    const transferFee = withTransfer ? 50 : 0 // Additional transfer fee
    setTotalPrice(adultPrice + childPrice + transferFee)
  })

  // Get available times for the selected day
  const getAvailableTimesForDay = (day: string) => {
    return availableTimes[day as keyof typeof availableTimes] || []
  }

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true)
    try {
      console.log("Form submitted:", data)
      // Simulate API call delay (remove this in production)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Here you would typically send the data to your backend
      alert(
        `Réservation confirmée pour ${data.firstName} ${data.lastName}\n` +
        `${data.adults} adulte(s) et ${data.children} enfant(s)\n` +
        `Le ${availableDays.find(d => d.value === data.day)?.label} à ${data.time}\n` +
        `${data.withTransfer ? 'Avec transfert' : 'Sans transfert'}\n` +
        `Contact: ${data.phone} / ${data.email}`
      )
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsLoading(false)
    }
  }



  return (
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

        {/* Booking Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jour</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un jour" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableDays.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horaire</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDay}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Horaire" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedDay && getAvailableTimesForDay(selectedDay).map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Number of People */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="adults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adultes</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    const adultPrice = 70 * Number.parseInt(value)
                    const childPrice = 0 * selectedChildren
                    const transferFee = withTransfer ? 50 : 0
                    setTotalPrice(adultPrice + childPrice + transferFee)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Adultes" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
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
                  onValueChange={(value) => {
                    field.onChange(value)
                    const adultPrice = 70 * selectedAdults
                    const childPrice = 0 * Number.parseInt(value)
                    const transferFee = withTransfer ? 50 : 0
                    setTotalPrice(adultPrice + childPrice + transferFee)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Enfants" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
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
                  onCheckedChange={(checked) => {
                    field.onChange(checked)
                    const adultPrice = 70 * selectedAdults
                    const childPrice = 0 * selectedChildren
                    const transferFee = checked ? 50 : 0
                    setTotalPrice(adultPrice + childPrice + transferFee)
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Ajouter le transfert (+50 EUR)
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
          className="w-full bg-[#0a8a8a] hover:bg-[#0a8a8a]/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Traitement...
            </>
          ) : (
            "Réserver maintenant"
          )}
        </Button>

        <div className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
          <Info size={12} />
          <span>Annulation gratuite jusqu'à 48h avant l'activité</span>
        </div>
      </form>
    </Form>
  )
}