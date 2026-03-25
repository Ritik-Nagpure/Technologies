import { useSelector } from "react-redux"

const Billing = () => {
    const itemList = useSelector((state) => state.cart.value)
    console.log(itemList);

    return (
        <div className="h-full w-full bg-amber-50 p-4 ">
            <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
                <thead className="bg-amber-200">
                    <tr>
                        <th className="px-4 py-2 text-left text-lg font-bold border border-gray-300">Item</th>
                        <th className="px-4 py-2 text-left text-lg font-bold border border-gray-300">Price</th>
                        <th className="px-4 py-2 text-left text-lg font-bold border border-gray-300">Qty</th>
                        <th className="px-4 py-2 text-left text-lg font-bold border border-gray-300">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {itemList.map((item) => (
                        <tr key={item.id} className="hover:bg-amber-100">
                            <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                            <td className="px-4 py-2 border border-gray-300">₹ {(item.price).toStringLocale}</td>
                            <td className="px-4 py-2 border border-gray-300">{item.quantity}</td>
                            <td className="px-4 py-2 border border-gray-300">₹ {item.price * item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-amber-200 font-semibold">
                    <tr>
                        <td className="px-4 py-2 border border-gray-300" colSpan="3">Total</td>
                        <td className="px-4 py-2 border border-gray-300">
                            ₹ {itemList.reduce((acc, obj) => acc + obj.price * obj.quantity, 0)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

    )
}

export default Billing