import axios from 'axios';

export type CityListType = {
    name: string;
    country: string;
};

export const getCityList = async (): Promise<CityListType[]> => {
    const url = 'https://sarvum.onrender.com/api/rihal/rides';

    let data: CityListType[] = [];

    try {
        const response = await axios.get(url);
        data = response.data.cities || [];
    }
    catch (err: any) {
        console.error("Fetch Error:", err?.response?.data || err.message);
    }
    return data;
};