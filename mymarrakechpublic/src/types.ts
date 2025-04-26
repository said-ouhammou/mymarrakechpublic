// Type for schedule information
export type ScheduleType = {
    id: number;
    activity_id: number;
    days: string;
    start_time: string;
    end_time: string;
  };
  
  // Type for price information
  export type PriceType = {
    id: number;
    activity_id: number;
    person: string; 
    price: number;
  };
  
  // Type for the activity object
  export type ActivityType = {
    id: number;
    supplier_id: number;
    category_id: number;
    title: string;
    slug: string;
    image_path: string | null;
    description: string;
    payment_methods: string; // JSON string
    localisation: string;
    rating: number | null;
    person: string | null;
    persons_number: number | null;
    price: number;
    discount: number;
    discount_type: string;
    display_order: number;
    is_featured: number;
    category_title: string;
    category_description: string | null;
    price_person: string; // "adult", "enfant" or other types
    price_amount: number;
    price_commission: number;
    commission_type_is_percentage: number;
    schedules: ScheduleType[];
    prices: PriceType[];
  };
  
  // Type for the page object
  export type PageType = {
    id: number;
    supplier_id: number;
    user_id: number;
    slug: string;
    page_number: string;
    page_style: string | null;
    public_token: string;
    base_url: string;
    qr_code_path: string | null;
    status: string;
    is_active: number;
    view_count: number;
    last_accessed_at: string | null;
    observation: string | null;
    created_at: string;
    updated_at: string;
  };
  
  // Type for the root object
  export type RootType = {
    page: PageType;
    activity: ActivityType;
  };
  
  