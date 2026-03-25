import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import CartItem from "./CartItem"
import { removeitem, edititem } from "../../store/cartstore"

const Cart = ({ onproceed }) => {
    const cartProducts = useSelector((state) => state.cart.value);
    const dispatch = useDispatch();

    const [totalAmount, setTotalAmount] = useState(0);

    const calculateTotal = () => {
        let copy_arr = [...cartProducts];
        const sum = copy_arr.reduce((acc, obj) => acc + obj.quantity * obj.price, 0)
        setTotalAmount(sum);
    }

    const updateCart = (currItem, isdelete) => {
        if (isdelete) {
            dispatch(removeitem(currItem));
        }
        else {
            dispatch(edititem(currItem));
        }
    }

    useEffect(() => calculateTotal(), [cartProducts])

    return (
        <div className="h-full flex flex-col py-1 overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none]">
            <div className="text-xl font-bold flex flex-row justify-between items-center px-2 my-1 ">
                <div>
                    <span className="">Total : ₹ </span>
                    <span className="font-semibold">{totalAmount.toLocaleString()} </span>
                </div>
                <button className=" text-gray-100 bg-violet-600 px-4 py-2 rounded active:scale-95 transition-transform hover:transition-colors hover:bg-violet-900 hover:duration-200 inline-block" onClick={() => { onproceed() }}>
                    Proceed
                </button>
            </div>
            <div className="overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none]">
                {cartProducts.map((cartproduct) => <CartItem key={cartproduct.id} product={cartproduct} editcart={updateCart} />)}
            </div>
        </div>
    )
}

export default Cart
