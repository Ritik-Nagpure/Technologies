import { useNavigate } from 'react-router-dom';

const L01 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-8 min-h-screen ">
      <div className="flex flex-row justify-between items-center w-full max-w-3/6">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">
          Lesson 1: React Basics
        </h1>
        <button
          onClick={() => navigate("/Core")}
          className="bg-blue-400 px-4 py-2 rounded text-white hover:bg-blue-500 transition"
        >
          Back
        </button>
      </div>


      <div className="flex flex-col items-center max-w-3xl space-y-6 text-gray-100 ">

        {/* What is React */}
        <div className="w-full h-fit " >
          <h2 className="text-xl font-semibold mb-2">1. What is React?</h2>
          <p>
            React is a JavaScript library for building user interfaces. It was developed by Meta (Facebook)
            and focuses on creating reusable components and a declarative way of describing UI.
          </p>
        </div>

        {/* Components */}
        <div className="w-full h-fit " >
          <h2 className="text-xl font-semibold mb-2">2. Components</h2>
          <p>
            Components are the building blocks of React applications. They can be functional or class-based.
          </p>
          <pre className="bg-gray-200 p-3 rounded text-sm w-full text-black">
            {`function Welcome() {
                    return <h1>Hello, React!</h1>;
                  }
              export default Welcome;`}
          </pre>
        </div>

        {/* JSX */}
        <div className="w-full h-fit " >
          <h2 className="text-xl font-semibold mb-2">3. JSX</h2>
          <p>
            JSX is a syntax extension that lets you write HTML-like code inside JavaScript. It makes UI code
            easier to read and write.
          </p>
          <pre className="bg-gray-200 p-3 rounded text-sm overflow-x-auto text-black">
            {`const element = <h1>Welcome to React</h1>;`}
          </pre>
        </div>

        {/* Props */}
        <div className="w-full h-fit " >
          <h2 className="text-xl font-semibold mb-2">4. Props</h2>
          <p>
            Props (short for properties) allow you to pass data from a parent component to a child component.
          </p>
          <pre className="bg-gray-200 p-3 rounded text-sm overflow-x-auto text-black">
            {`function Greeting(props) {
                return <h1>Hello, {props.name}!</h1>;
              }
              <Greeting name="Alice" />`}
          </pre>
        </div>

        {/* State */}
        <div className="w-full h-fit " >
          <h2 className="text-xl font-semibold mb-2">5. State</h2>
          <p>
            State is used to store data that can change over time. Updating state re-renders the component.
          </p>
          <pre className="bg-gray-200 p-3 rounded text-sm overflow-x-auto text-black">
            {`import { useState } from "react";
              function Counter() {
                const [count, setCount] = useState(0);

                return (
                  <div className="w-full h-fit " >
                    <p>You clicked {count} times</p>
                    <button onClick={() => setCount(count + 1)}>Click me</button>
                  </div>
                );
              }`}
          </pre>
        </div>

        {/* Rendering */}
        <div className="w-full h-fit " >
          <h2 className="text-xl font-semibold mb-2">6. Rendering</h2>
          <p>
            React updates the UI efficiently using its Virtual DOM. You can render lists and conditionally
            show elements.
          </p>
          <pre className="bg-gray-200 p-3 rounded text-sm overflow-x-auto text-black">
            {`const items = ["Apple", "Banana", "Cherry"];
              function FruitList() {
                return (
                  <ul>
                    {items.map((fruit, index) => (
                      <li key={index}>{fruit}</li>
                    ))}
                  </ul>
                );
              }`}
          </pre>
        </div>

      </div>
    </div>
  );
};

export default L01;
