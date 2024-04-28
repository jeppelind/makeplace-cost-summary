import { promises as fs } from 'fs';
import { DataCenter, ItemId } from "./lib/types";
import { Provider } from "jotai";
import FileSelecter from "./components/file-selecter";
import Costs from './components/costs';
import { Suspense } from 'react';

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
  const itemIdsFile = await fs.readFile(`${process.cwd()}/itemIds.json`, 'utf-8');
  const itemIds: ItemId[] = JSON.parse(itemIdsFile);

  return (
    <main className="container mx-auto flex flex-col items-center p-24">
      <h2>{dataCenters.length}</h2>
      <Provider>
        {/* <PricesSection dataCenters={dataCenters} /> */}
        <FileSelecter dataCentersFromServer={dataCenters} itemIdsFromServer={itemIds} />
        <Suspense fallback={<h1>Loading costs...</h1>}>
          <Costs />
        </Suspense>
      </Provider>
    </main>
  );
}
