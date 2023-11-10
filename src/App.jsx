import React from 'react'
import { BrowserRouter, Routes, Route} from "react-router-dom"
import Signout from './pages/Signout'
import About from './pages/About'
import Profile from './pages/Profile'
import Signin from './pages/Signin'
import Home from './pages/Home'

const App = () => {
  return (<BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/signin" element={<Signin />}/>
        <Route path="/signout" element={<Signout />}/>

        
      </Routes>
      </BrowserRouter>

  )
}

export default App
