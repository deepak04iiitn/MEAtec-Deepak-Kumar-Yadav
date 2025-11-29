import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Footer from './components/Footer'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route path='/' element={<Home />} />
            {/* <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/profile' element={<Profile />} /> */}
        </Routes>
      </div>
      <Footer />
    </div>
    </BrowserRouter>
  )
}
