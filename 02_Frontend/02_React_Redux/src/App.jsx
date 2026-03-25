import { useState } from "react";
import Display from "./components/Layout/Display"
import Footer from "./components/Layout/Footer"
import Header from "./components/Layout/Header"
import { BrowserRouter } from "react-router";
function App() {
  const [isCartVisible, setIsCartVisible] = useState(false);

  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-between">

        <BrowserRouter>
          <div className="w-full h-fit bg-amber-900">
            <Header togglecart={setIsCartVisible} cartvisiblity={isCartVisible} />
          </div>

          <div className="w-full h-full">
            <Display isCartVisible={isCartVisible} />
          </div>
        </BrowserRouter>

        <div className="w-full h-fit mb-0">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default App
