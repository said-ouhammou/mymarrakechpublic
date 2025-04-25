import {lazy} from "react";

export const GuestLayout = lazy(() => import('@/components/layouts/GuestLayout.tsx'));
export const Home = lazy(() => import('@/pages/home/Home.tsx'));
export const BookingPage = lazy(() => import('@/pages/listings/BookingPage.tsx'));
export const ListingsPage = lazy(() => import('@/pages/listings/ListingsPage.tsx'));
export const NotFoundPage = lazy(() => import('@/pages/notFound/NotFoundPage.tsx'));



