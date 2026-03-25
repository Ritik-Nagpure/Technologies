import React from 'react'

const Product = ({ productdetail, buypress }) => {
    return (
        <div>
            <div className="border rounded-lg shadow p-4">
                <img
                    src={productdetail.imgurl}
                    alt={productdetail.name}
                    className="w-full h-40 object-cover rounded"
                />
                <h3 className="text-lg font-bold mt-2">{productdetail.name}</h3>
                <p className="text-sm text-gray-600">{productdetail.desc}</p>
                <p className="text-yellow-700 font-semibold mt-2">₹{productdetail.price}</p>
                <button className='text-lg font-bold text-gray-100 px-4 py-1 mt-1 rounded active:scale-95 transition-transform hover:transition-colors bg-violet-800 hover:duration-500 inline-block' onClick={() => buypress(productdetail)}>
                    Buy
                </button>
            </div>
        </div>
    )
}

export default Product