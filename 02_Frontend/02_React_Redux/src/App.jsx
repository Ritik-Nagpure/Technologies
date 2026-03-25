import { useState } from "react";
import Display from "./components/Layout/Display"
import Header from "./components/Layout/Header"
import { BrowserRouter } from "react-router";
function App() {
  const [isCartVisible, setIsCartVisible] = useState(false);

  return (
    <div className=" w-full h-screen flex flex-col items-center justify-between overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none]">
      <BrowserRouter>
        <div className="w-full z-50">
          <Header togglecart={setIsCartVisible} cartvisiblity={isCartVisible} />
        </div>

        <div className=" w-full overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none]">
          <Display isCartVisible={isCartVisible} />
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App
