'use client'

import { Provider, useSetAtom } from "jotai";
import Costs from '../components/costs';
import Options from "../components/options";
import { Suspense, useEffect, useState } from "react";
import Loader from "../components/loader";
import { useParams } from "next/navigation";
import { findItemList } from "../actions";
import { makePlaceFilenameAtom, makePlaceListAtom, selectedCenterAtom } from "../lib/jotai-store";

const ItemsSummary = () => {
  const setSelectedCenter = useSetAtom(selectedCenterAtom);
  const setMakePlaceFilename = useSetAtom(makePlaceFilenameAtom);
  const setMakePlaceList = useSetAtom(makePlaceListAtom);
  const { key } = useParams<{ key: string }>();
  const [noData, setNoData] = useState(false);

  console.log(`SHARED PAGE ${key}`);

  useEffect(() => {
    console.log(`Key changed to ${key}`);
    const fetchItems = async () => {
      const list = await findItemList(key);
      console.log('fetch done')
      if (list) {
        setSelectedCenter(list.dataCenter);
        setMakePlaceFilename(list.key);
        setMakePlaceList(list.items);
      } else {
        setNoData(true);
      }
    }
    fetchItems();
  }, [key, setMakePlaceFilename, setMakePlaceList, setSelectedCenter]);

  if (noData) {
    return (
      <div>Could not find anything saved for {key}</div>
    )
  }

  return (
    <>
      <Options />
      <Costs />
    </>      
  );
}

export default function Page() {
  
  return (
    <main className="container mx-auto flex flex-col items-center px-12 grow gap-6">
      <Suspense fallback={<Loader />}>
        <Provider>
          <ItemsSummary />
        </Provider>
      </Suspense>
    </main>
  );
}
