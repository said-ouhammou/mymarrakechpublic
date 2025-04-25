import Header from '../custom/includes/Header'
import Footer from '../custom/includes/Footer'
import { Outlet } from 'react-router'
import { Toaster } from 'sonner'

export default function GuestLayout() {
  return (
    <>
        <Header/>
        <Outlet/>
        <Footer/>
        <Toaster/>
    </>
  )
}
