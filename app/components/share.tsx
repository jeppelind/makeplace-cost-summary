'use client'

import { useAtomValue } from "jotai";
import { createItemList } from "../actions";
import { makePlaceListAtom, selectedCenterAtom } from "../lib/jotai-store";
import { useState } from "react";

const Share = () => {
  const selectedCenter = useAtomValue(selectedCenterAtom)
  const makePlaceList = useAtomValue(makePlaceListAtom);
  const [itemListKey, setItemListKey] = useState('');

  const saveItems = async () => {
    console.log('Share');
    const { key, error } = await createItemList({
      key: '',
      dataCenter: selectedCenter,
      items: makePlaceList,
    });
    if (error) {
      console.error(error);
    }
    setItemListKey(key || '');
  }

  if (itemListKey !== '') {
    return (
      <p>Saved as {itemListKey}</p>
    )
  }

  return (
    <div>
      <button onClick={saveItems}>Share</button>
    </div>
  )
}

export default Share;