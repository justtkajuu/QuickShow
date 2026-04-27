import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation  } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDeatils from './pages/MovieDeatils'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import {Toaster} from 'react-hot-toast' 
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddShow from './pages/admin/AddShow'
import ListShow from './pages/admin/ListShow'
import ListBooking from './pages/admin/ListBooking'
import { useAppContext } from './context/AppContext'
import { SignIn } from '@clerk/react'

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  const {user} = useAppContext()

  return (
    <> 
    <Toaster/> 
    {!isAdminRoute && <Navbar />}
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/movies' element={<Movies/>}/>
      <Route path='/movies/:id' element={<MovieDeatils/>}/>
      <Route path='/movies/:id/:date' element={<SeatLayout/>}/>
      <Route path='/my-bookings' element={<MyBookings/>}/>
      <Route path='/favorite' element={<Favorite/>}/>
      
      {/* Admin Routes */}
      <Route path='/admin/*' element={ user ? <Layout/> : (
        <div className='min-h-screen flex justify-center items-center'>
          <SignIn fallbackRedirectUrl={'/admin'}/>
        </div>
      )}>
        <Route index element={<Dashboard/>}/>
        <Route path='add-shows' element={<AddShow/>}/>
        <Route path='list-shows' element={<ListShow/>}/>
        <Route path='list-bookings' element={<ListBooking/>}/>
      </Route>
    </Routes>
    {!isAdminRoute && <Footer />}
    </>
  )
}

export default App