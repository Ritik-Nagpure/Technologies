import { useState, useRef } from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export default function Component() {

    const salesData = [
        { month: "Jan", sales: 4000, profit: 2400 },
        { month: "Feb", sales: 3000, profit: 1398 },
        { month: "Mar", sales: 5000, profit: 3200 },
        { month: "Apr", sales: 4780, profit: 2908 },
        { month: "May", sales: 5890, profit: 3800 },
        { month: "Jun", sales: 6390, profit: 4300 },
        { month: "Jul", sales: 7490, profit: 5200 },
    ];

    // visible window
    const [range, setRange] = useState({
        start: 0,
        end: salesData.length - 1,
    });

    // drag state
    const dragStartX = useRef(null);

    // visible data
    const visibleData = salesData.slice(
        range.start,
        range.end + 1
    );

    // -----------------------------
    // ZOOM WITH MOUSE WHEEL
    // -----------------------------
    const handleWheel = (e) => {
        e.preventDefault();

        const zoomStep = 1;

        setRange((prev) => {

            let { start, end } = prev;

            // zoom out
            if (e.deltaY > 0) {

                start = Math.max(0, start - zoomStep);
                end = Math.min(
                    salesData.length - 1,
                    end + zoomStep
                );

            }

            // zoom in
            else {

                if (end - start <= 1) return prev;

                start += zoomStep;
                end -= zoomStep;
            }

            return { start, end };
        });
    };

    // -----------------------------
    // START DRAG
    // -----------------------------
    const handleMouseDown = (e) => {
        dragStartX.current = e.clientX;
    };

    // -----------------------------
    // DRAG MOVE
    // -----------------------------
    const handleMouseMove = (e) => {

        if (dragStartX.current === null) return;

        const diff = e.clientX - dragStartX.current;

        // sensitivity
        const moveThreshold = 40;

        if (Math.abs(diff) < moveThreshold) return;

        setRange((prev) => {

            let { start, end } = prev;

            const visibleWindow = end - start;

            // drag right -> move left
            if (diff > 0) {

                start = Math.max(0, start - 1);
                end = start + visibleWindow;

            }

            // drag left -> move right
            else {

                end = Math.min(
                    salesData.length - 1,
                    end + 1
                );

                start = end - visibleWindow;
            }

            return { start, end };
        });

        dragStartX.current = e.clientX;
    };

    // -----------------------------
    // END DRAG
    // -----------------------------
    const handleMouseUp = () => {
        dragStartX.current = null;
    };

    // -----------------------------
    // POINT CLICK
    // -----------------------------
    const handlePointClick = (data) => {
        console.log("Clicked Point:");
        console.log(data);
    };

    return (
        <div className="w-9/12 rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6">
                <h1 className="text-3xl font-bold">
                    Sales Analytics
                </h1>
            </div>

            <div
                className="h-100 w-full cursor-grab active:cursor-grabbing"

                onWheel={handleWheel}

                onMouseDown={handleMouseDown}

                onMouseMove={handleMouseMove}

                onMouseUp={handleMouseUp}

                onMouseLeave={handleMouseUp}
            >

                <ResponsiveContainer width="100%" height="100%">

                    <LineChart data={visibleData}>

                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Legend />

                        {/* Sales */}
                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#2563eb"
                            strokeWidth={3}
                            activeDot={{
                                r: 8,
                                onClick: (_, payload) => {
                                    handlePointClick(
                                        payload.payload
                                    );
                                },
                            }}
                        />

                        {/* Profit */}
                        <Line
                            type="monotone"
                            dataKey="profit"
                            stroke="#16a34a"
                            strokeWidth={3}
                            activeDot={{
                                r: 8,
                                onClick: (_, payload) => {
                                    handlePointClick(
                                        payload.payload
                                    );
                                },
                            }}
                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}