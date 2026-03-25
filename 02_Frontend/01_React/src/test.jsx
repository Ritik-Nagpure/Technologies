import React, { useState, useEffect } from "react";

function UseEffectCounter() {
    const [count, setCount] = useState(0);
    const [effectRuns, setEffectRuns] = useState(1);

    // This effect runs every time `count` changes
    useEffect(() => {
        console.log(`useEffect triggered! ${count}`);
    }, [count]);

    const counthandle = () => {
        setCount(count + 1)
        setEffectRuns(prev => {
            console.log("Previous effect count:", prev);
            return prev + 1;
        });
    }
    return (
        <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
            <h2>useEffect Counter Test</h2>
            <p>Count: {count}</p>
            <p>useEffect has run: {effectRuns} times</p>
            <button onClick={() => counthandle()}>Increment Count</button>
        </div>
    );
}

export default UseEffectCounter;
