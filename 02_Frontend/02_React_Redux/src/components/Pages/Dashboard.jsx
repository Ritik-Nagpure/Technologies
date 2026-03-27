import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getdata } from "../../store/cityLists";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { loading, cities, err, iserror } = useSelector((state) => state.citylist)

  useEffect(() => { dispatch(getdata()) }, [dispatch])

  return (
    <div className="h-fit flex justify-center items-center">
      <div className="h-full w-full bg-amber-50 p-4 ">
        {
          loading ? cities[0] : iserror ? err : datatable(cities)
        }
      </div>
    </div>
  )
}

const datatable = (data) => {
  return (
    <div>
      <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg">
        <thead className="bg-amber-500">
          <tr>
            <th className="px-4 py-2 text-left text-lg font-bold border border-gray-300">Name</th>
            <th className="px-4 py-2 text-left text-lg font-bold border border-gray-300">Country</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((item, index) => (
              <tr key={index} className="hover:bg-amber-200">
                <td className="px-4 py-2 border border-gray-300">{item.name}</td>
                <td className="px-4 py-2 border border-gray-300">{item.country}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard