import { useDispatch, useSelector } from "react-redux"
// import { increment, decrement } from '../../store/store'
import Home from "../Pages/Home";
import Cart from "../Pages/Cart";
import { useState } from "react";
import { Route, Routes } from "react-router";
import Products from "../Pages/Products";

const Display = ({ isCartVisible }) => {
  // const count = useSelector((state) => state.counter.value);
  // const dispatch = useDispatch();


  return (
    <div className='relative h-fit'>
      <div className=" flex flex-col justify-center items-center h-full ">
        {/* <p className="text-6xl text-amber-800">
        Count is {count}
      </p>
      <div>
        <button className="text-3xl bg-green-300 px-10 py-2 m-2 rounded-xl" onClick={() => dispatch(increment())}>+</button>
        <button className="text-3xl bg-red-300 px-10 py-2 m-2 rounded-xl" onClick={() => dispatch(decrement())}>-</button>
      </div> */}

        <Routes >
          <Route path="/" element={<Home />} />
          <Route path="/Products" element={<Products />} />
        </Routes>

      </div>
      <div className={` ${isCartVisible ? 'block' : 'hidden'} absolute top-0 right-0  bg-gray-100 m-2 rounded-xl border-2 p-4 sm:w-3/12 w-36 h-screen overflow-y-scroll`}>
        <Cart />
      </div>
    </div>
  )
}

export default Display