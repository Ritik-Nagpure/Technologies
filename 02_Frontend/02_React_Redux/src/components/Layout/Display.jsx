import { useState } from "react";
import { Route, Routes } from "react-router";

import Home from "../Pages/Home";
import Cart from "../Pages/Cart";
import Footer from "./Footer";
import Products from "../Pages/Products";
import Billing from "../Pages/Billing";
import Dashboard from '../Pages/Dashboard'

const Display = ({ isCartVisible }) => {
  const [isBilling, setIsBilling] = useState(false);

  const toggleBilling = () => {
    setIsBilling(!isBilling);
  }



  return (
    <div className="w-full h-full">

      <div className=" flex flex-col justify-center items-center w-full h-full overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none]">
        <div className='h-full w-full'>
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/Products" element={<Products />} />
            <Route path="/Dashboard" element={<Dashboard />} />
          </Routes>
          <div className="bottom-0 w-full">
            <Footer />
          </div>
        </div>

        <div className={` ${isCartVisible ? 'block' : 'hidden'} absolute top-0 right-0 bg-gray-100 my-2 mx-4 rounded-xl border-2 p-4 sm:w-3/12 w-36 h-screen`}>
          <Cart onproceed={toggleBilling} />
        </div>




      </div>

      <div className="relative">
        {isBilling && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white rounded-lg shadow-lg p-6 w-2/6 pointer-events-auto">
              <div className="flex flex-row justify-between items-center  mx-4">
                <span className="text-2xl font-bold ">Billing Info</span>
                <span className="text-red-500 font-extrabold text-2xl" onClick={() => { toggleBilling() }}>X</span>
              </div>
              <Billing />
            </div>
          </div>
        )}
      </div>

    </div>
  )
}

export default Display