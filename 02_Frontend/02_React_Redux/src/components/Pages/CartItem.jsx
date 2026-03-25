import React, { useState } from 'react'

const CartItem = ({ product, editcart }) => {

    const updatequantity = (stat) => {
        let a = { ...product };
        let task = false;
        if (a.quantity === 1 && stat === 0) {
            task = true
        }
        if (stat === 1) {
            a.quantity += 1;
        }
        if (stat === 0) {
            a.quantity -= 1;
        }
        editcart(a, task)
    }

    return (
        <div className="flex flex-row my-1 p-2 border-2 rounded-lg bg-gray-200">
            <div className="border-2 rounded-lg contain-content">
                <img className='h-28 w-28' src={product['imgurl']} />
            </div>

            <div className="flex flex-col py-0.5 px-2">
                <span className=''>{product.name}</span>
                <span className=''>{product.quantity}</span>
                <span className=''>₹ {product.price * product.quantity}</span>

                <div className='flex flex-row justify-evenly items-center'>
                    <button className='h-fit w-8 text-xl font-bold text-gray-100 px-2 py-1 m-0.5 rounded active:scale-95 transition-transform hover:transition-colors bg-blue-600 hover:bg-blue-900 hover:duration-500 inline-block' onClick={() => updatequantity(1)}>
                        +
                    </button>

                    <button className='h-fit w-8 text-xl font-bold text-gray-100 px-2 py-1 m-0.5 rounded active:scale-95 transition-transform hover:transition-colors bg-blue-600 hover:bg-blue-900 hover:duration-500 inline-block' onClick={() => updatequantity(0)}>
                        -
                    </button>

                    <button className='h-fit text-xl font-bold text-gray-100 px-2 py-1 m-0.5 rounded active:scale-95 transition-transform hover:transition-colors bg-red-600 hover:bg-red-900 hover:duration-500 inline-block' onClick={() => editcart(product, true)}>
                        Remove
                    </button>
                </div>

            </div>
        </div>

    )
}

export default CartItem