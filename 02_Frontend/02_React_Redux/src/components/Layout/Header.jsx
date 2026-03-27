import { useNavigate } from "react-router"

const Header = ({ cartvisiblity, togglecart }) => {
    const navig = useNavigate();
    return (

        <div className="relative h-fit w-full bg-gray-900 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

                <button className="flex items-center space-x-3" onClick={() => { navig('/') }}>
                    <div className="h-14 w-14 p-1 bg-amber-200  text-amber-900 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold">SCB</span>
                    </div>
                    <div className="flex flex-col justify-baseline items-baseline">
                        <h1 className="text-2xl font-semibold">Sweet Crumbs Bakery</h1>
                        <p className="text-md text-red-300">Est. 1995</p>
                    </div>
                </button>

                <div className="hidden md:flex items-center space-x-6">
                    <button className="text-2xl font-bold text-gray-100 px-4 py-2 rounded active:scale-95 transition-transform hover:transition-colors hover:bg-violet-800 hover:duration-500 inline-block" onClick={() => { navig('/') }}>
                        Home
                    </button>
                    <button className="text-2xl font-bold text-gray-100 px-4 py-2 rounded active:scale-95 transition-transform hover:transition-colors hover:bg-violet-800 hover:duration-500 inline-block" onClick={() => { navig('/Products') }}>
                        Products
                    </button>
                    <button className="text-2xl font-bold text-gray-100 px-4 py-2 rounded active:scale-95 transition-transform hover:transition-colors hover:bg-violet-800 hover:duration-500 inline-block" onClick={() => { navig('/Dashboard') }}>
                        Dashboard
                    </button>
                    <button className="px-4 py-2 rounded active:scale-95 transition-transform" onClick={() => togglecart(!cartvisiblity)}>
                        <img className="h-12 w-12 rounded-full " src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuiKaSKgi6QUjM2K5dKY1XuRfvX5BX9wwOTg&s" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Header