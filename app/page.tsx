import { DataCenter } from "./lib/types";
import { Provider } from "jotai";
import FileSelecter from "./components/file-selecter";
import Costs from './components/costs';
import Options from "./components/options";
import { Suspense } from "react";
import Loader from "./components/loader";

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
  const dataCenters = getDataCenters();

  return (
    <main className="container mx-auto flex flex-col items-center px-4 md:px-12 grow gap-6">
      <Suspense fallback={<Loader />}>
        <Provider>
          <FileSelecter dataCentersFromServer={dataCenters} />
          <Options showAdvanced={true} />
          <Costs />
        </Provider>
      </Suspense>
    </main>
  );
}
