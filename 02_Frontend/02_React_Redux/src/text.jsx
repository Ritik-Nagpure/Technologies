import { useState, useEffect } from 'react'
import axios from 'axios'


const Test = () => {

    const url = 'https://jsonplaceholder.typicode.com/users'

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetcheddata = axios.get(url)
            .then(res => res.data)
            .then(res => setData(res))
            .catch(err => alert(err))

    }, [])

    return (
        <div className='text-2xl'>
            data is:
            {data.map((item, index) => {
                return (
                    <div key={index}>
                        <p>lng : {item.address.geo.lng}</p>
                        <p>zipcode : {item.address.zipcode}</p>
                        <p>email : {item.email}</p>
                        <p>username : {item.username}</p>
                        <br>
                         </br>
                    </div>
                )

            })}

        </div>
    )


}

export default Test;