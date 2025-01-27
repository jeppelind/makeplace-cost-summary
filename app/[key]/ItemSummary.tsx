'use client'

import { useEffect, use } from "react";
import { useSetAtom } from "jotai";
import { makePlaceListAtom, makePlaceFilenameAtom, selectedCenterAtom } from "../lib/jotai-store";
import { ItemList } from "../actions";
import Options from "../components/options";
import Costs from "../components/costs";

type ItemSummaryProps = {
  itemListFromServer: Promise<ItemList | null>,
}

const ItemsSummary = ({ itemListFromServer }: ItemSummaryProps) => {
  const itemList = use(itemListFromServer);
  const setSelectedCenter = useSetAtom(selectedCenterAtom);
  const setMakePlaceFilename = useSetAtom(makePlaceFilenameAtom);
  const setMakePlaceList = useSetAtom(makePlaceListAtom);

  useEffect(() => {
    if (itemList) {
      setSelectedCenter(itemList.dataCenter);
      setMakePlaceFilename(itemList.key);
      setMakePlaceList(itemList.items);
    }
  }, [itemList, setMakePlaceFilename, setMakePlaceList, setSelectedCenter]);

  if (!itemList) {
    return (
      <div>Could not find saved layout. Please check url.</div>
    )
  }

  return (
    <>
      <Options />
      <Costs />
    </>      
  );
}

export default ItemsSummary;
