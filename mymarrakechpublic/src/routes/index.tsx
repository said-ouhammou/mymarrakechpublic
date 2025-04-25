
import {
    Home,
    BookingPage,
    ListingsPage,
    GuestLayout,
    NotFoundPage
} from "@/routes/imports.ts";

export const routes = [

    {
        path: "/",
        layout: GuestLayout,
        routes: [
            { path: "/", component: Home },
            { path: "/:slug", component: ListingsPage },
            { path: "/:slug/:id", component: BookingPage },
            { path: "/*", component: NotFoundPage },
        ],
    },
    
];
