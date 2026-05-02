
import DemoForm from "./pages/Form_demo"

const App = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full my-2 bg-gray-200">
      <div className="text-5xl text-green-500 font-bold">
        React Hook Form
      </div>

      <div className="">
        <DemoForm />
      </div>

    </div>
  )
}

export default App
