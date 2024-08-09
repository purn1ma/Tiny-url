import axios from "axios";
// import { DashboardType, columns } from "../components/columns";
import { DashboardType, DataTable } from "../components/DataTable"
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

async function getData(cookies: any): Promise<DashboardType[]> {
  const { data } = await axios.get(`https://tinyurl-8d0g.onrender.com/api/tinyurl/getAllUrls`, { headers: { authorization: cookies } })
  
  return data;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardType[]>([]);
  const [cookies, _] = useCookies(["jwt"])
  const getAllData = async () => {
    const fetchedData = await getData(cookies.jwt);
    setData(fetchedData);
  }
  
  useEffect(() => {
    getAllData()
  }, [])

  return (
    <div className=" pl-52 pr-52 pt-28 space-y-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DataTable data={data} />
    </div>
  );
}
