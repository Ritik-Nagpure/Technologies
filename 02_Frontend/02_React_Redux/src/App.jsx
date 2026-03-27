import { useState } from "react";
import Display from "./components/Layout/Display"
import Header from "./components/Layout/Header"
import { BrowserRouter } from "react-router";
import Footer from "./components/Layout/Footer";
function App() {
  const [isCartVisible, setIsCartVisible] = useState(false);

  return (
    <div className="h-full w-full flex flex-col">
      <BrowserRouter>
        <div className=" w-full z-50">
          <Header togglecart={setIsCartVisible} cartvisiblity={isCartVisible} />
        </div>

        <div className=" flex-1 w-full overflow-y-scroll [scrollbar-width:none] [-ms-overflow-style:none]">
          <Display isCartVisible={isCartVisible} />
          <div className=" w-full">
            {/* <Footer /> */}
          </div>
        </div>
      </BrowserRouter>


    </div>
  )
}

export default App
