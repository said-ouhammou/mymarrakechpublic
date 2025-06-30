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
    image: string | null;
    description: string;
    payment_methods: string;
    localisation: string;
    category_title: string;
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
  
  export type BannerMetaData = {
    title:string;
    description:string
  }

  export type SupplierType = {
    id: number;
    company: string;
  };
  