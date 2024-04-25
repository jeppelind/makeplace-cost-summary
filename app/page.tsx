import { DataCenter } from "./types";
import PricesSection from './client-prices'

const getDataCenters = async () => {
  console.log('fetching data')
  const URL = 'https://universalis.app/api/v2/data-centers';
  try {
    const res = await fetch(URL, { next: { revalidate: 604800 } });
    if (!res.ok) {
      throw new Error(`Error fetching data. ${res.statusText}`);
    }
    const data: DataCenter[] = await res.json();
    console.log('got data')
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function Home() {
  const dataCenters = await getDataCenters();
  return (
    <main className="flex flex-col items-center p-24">
      <h2>{dataCenters.length}</h2>
      <PricesSection dataCenters={dataCenters} />
    </main>
  );
}
