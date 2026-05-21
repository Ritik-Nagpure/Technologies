import { getCityList, type CityListType } from "@/services/citylist";

// 1. Mark the component as async
export default async function Home() {

  // 2. Await the data directly
  const cityList = await getCityList();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-2xl font-bold mb-6">Available Cities</h1>

        <ul className="w-full space-y-2">
          {cityList.length > 0 ? (
            cityList.map((city, index) => (
              <li
                key={index}
                className="p-4 border rounded-lg flex justify-between hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <span className="font-medium">{city.name}</span>
                <span className="text-zinc-500">{city.country}</span>
              </li>
            ))
          ) : (
            <p className="text-zinc-500">No cities found.</p>
          )}
        </ul>
      </main>
    </div>
  );
}