import { DataCenter } from "./lib/types";
import { Provider } from "jotai";
import FileSelecter from "./components/file-selecter";
import Costs from './components/costs';
import Options from "./components/options";

const getDataCenters = async () => {
  const URL = 'https://universalis.app/api/v2/data-centers';
  try {
    const res = await fetch(URL, { next: { revalidate: 604800 } });
    if (!res.ok) {
      throw new Error(`Error fetching data. ${res.statusText}`);
    }
    const data: DataCenter[] = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function Home() {
  const dataCenters = await getDataCenters();

  return (
    <main className="container mx-auto flex flex-col items-center px-12 grow gap-6">
      <Provider>
        <FileSelecter dataCentersFromServer={dataCenters} />
        <Options />
        <Costs />
      </Provider>
    </main>
  );
}
