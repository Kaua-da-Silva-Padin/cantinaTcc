import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function App() {


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
        </Routes>
      </Router>
    </>
  )
}