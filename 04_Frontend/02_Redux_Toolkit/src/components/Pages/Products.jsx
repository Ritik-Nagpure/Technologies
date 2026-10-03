import Product from "./Product"
import { productList } from "../../assets/productList";
import { useDispatch } from "react-redux";
import { additem } from "../../store/cartstore";



const Products = () => {
    const dispatch = useDispatch();

    const handleBuy = (item) => {
        let newitem = { ...item }
        newitem.quantity = 1
        dispatch(additem(newitem));
    }

    return (
        <div className="overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none]">
            <section className="mb-10 ">
                <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                    {productList.map((product) => (
                        <Product key={product.id} productdetail={product} buypress={handleBuy} />
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Products