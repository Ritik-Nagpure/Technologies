import { useState, useCallback, useEffect } from "react";
// import { useApi } from "./useApi";
// import { useErrorHandler } from "./useErrorHandler";

// useErrorHandler.js
export const useErrorHandler = () => {
    const [error, setError] = useState(null);

    const handleError = useCallback((err) => {
        setError(err.message || "Something went wrong");
    }, []);

    const clearError = () => setError(null);

    return { error, handleError, clearError };
};

// useApi.js
export const useApi = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const { error, handleError } = useErrorHandler();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error("API Error");
                }

                const result = await res.json();
                setData(result);
            } catch (err) {
                handleError(err);
            } finally {
                // console.log(data);
                setLoading(false);
            }
        };
        if (url) fetchData();
    }, [url, handleError]);

    return { data, loading, error };
};



// Weather.jsx
const Weather = ({ city }) => {

    // const url = 'https://dummyjson.com/posts';
    // const url = 'https://dummyjson.com/products';
    const url = 'https://dummyjson.com/recipes';
    // const url = 'https://dummyjson.com/quotes';
    // const url = 'https://dummyjson.com/comments';


    const { data, loading, error } = useApi(url);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <hr></hr>
            <h3>Data City</h3>
            <p>{JSON.stringify(data, null, 2)}</p>
        </div>
    );
};

export default Weather;