import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import Profile from "./Pages/Profile/Profile";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useState, useEffect } from "react";
import supabase from './supabaseClient';

export default function App() {
  // useEffect(()=>{
  //   async function getData(table) {
  //     const {data, error} = await supabase.from(table).insert({
  //       name: 'Joao',
  //       age: 17
  //     })
  //     .select();
      
  //     if (data) {
  //       setUsers(data);
  //     } else if (error) {
  //       throw new Error(`ERROR SELECTING FROM SUPABASE!\n${error.message}`)
  //     }
  //   }

  //   getData('users');
  // },[])

  return(
    <>
      <Router>
        <Routes>
          <Route
          path='/'
          element={<Home/>}/>
          <Route
          path='/cart'
          element={<Cart/>}/>
          <Route
          path='/profile'
          element={<Profile/>}/>
        </Routes>
      </Router>
      <SpeedInsights/>
      <Analytics/>
    </>
  )
}