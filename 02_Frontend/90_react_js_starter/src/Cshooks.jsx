import { useCallback, useEffect, useState } from 'react'

export const useErrorhandler = () => {
    const [cuserr, setError] = useState(null);

    const setErrorFunc = (err) => {
        setError(err.message || 'Opps....')
    }

    return [cuserr, setErrorFunc]
}

export const useFetchCall = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cuserr, setErrorFunc] = useErrorhandler();

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                const res = await fetch(url)
                if (!res.ok) {
                    throw new Error("API Error")
                }
                const result = await res.json();
                setData(result);
            }
            catch (err) {
                setErrorFunc(err)
            }
            finally {
                setLoading(false)
            }
        }
        if (url) getData()
    }, [url])

    return { data, loading, cuserr }
}

const Cshooks = () => {
    // const url = 'https://dummyjson.com/posts';
    // const url = 'https://dummyjson.com/products';
    const url = 'https://dummyjson.com/recipes';
    // const url = 'https://dummyjson.com/quotes';
    // const url = 'https://dummyjson.com/comments';

    const { data, loading, cuserr } = useFetchCall(url)


    if (loading) return <p>Loading...</p>
    if (cuserr) return <p>{cuserr}</p>

    return (
        <div className='flex flex-col items-center justify-center text-4xl font-bold'>
            Custom API Example
            <div>
                {/* {error && <p>{error}</p>}
                {loading && <p>Loading...</p>} */}
                {JSON.stringify(data)}
            </div>
        </div>
    )
}

export default Cshooks