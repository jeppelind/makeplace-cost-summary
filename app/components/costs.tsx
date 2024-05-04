'use client'

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { priceListAtom, makePlaceListAtom, selectedCenterAtom, unresolvedItemsAtom, makePlaceFilenameAtom, hiddenItemIdsAtom, hiddenItemIdsForFileAtom } from "../lib/jotai-store";
import { useCallback, useEffect, useRef, useState } from "react";
import { MakePlaceItem, PriceListItem } from "../lib/types";
import InfoBox from "./info-box";
import Loader from "./loader";
import { FaSort } from "react-icons/fa";

type ResponseItem = {
  [key: string]: {
    listings: {
        pricePerUnit: number;
        worldName: string;
    }[],
  },
};

type ResponseObject = {
  dcName: string,
  unresolvedItems: [],
  items: ResponseItem,
}

const formatDisplayCost = (value: number) => {
  return new Intl.NumberFormat().format(value);
}

const TotalCost = () => {
  const priceList = useAtomValue(priceListAtom);
  const hiddenIds = useAtomValue(hiddenItemIdsForFileAtom);

  const totalCost = priceList.reduce((arr, curr) => {
    const combinedCostForUnits = (hiddenIds.includes(curr.id)) ? 0 : curr.units.reduce((arr2, curr2) => arr2 + curr2.pricePerUnit, 0);
    return arr + combinedCostForUnits;
  }, 0);

  return (
    <InfoBox>
      <label className="tracking-wider">Total cost</label>
      <h1 className="text-3xl font-extrabold text-center text-green-600">{formatDisplayCost(totalCost)}</h1>
    </InfoBox>
  );
}

const ItemCount = () => {
  const priceList = useAtomValue(priceListAtom);
  const hiddenIds = useAtomValue(hiddenItemIdsForFileAtom);
  const itemCount = priceList.reduce((acc, curr) => acc + (hiddenIds.includes(curr.id) ? 0 : curr.units.length), 0);

  return (
    <InfoBox>
      <label className="tracking-wider">Item count</label>
      <h1 className="text-3xl font-extrabold text-center">{itemCount}</h1>
    </InfoBox>
  );
}

const UnresolvedItems = () => {
  const unresolvedItems = useAtomValue(unresolvedItemsAtom);
  const makePlaceList = useAtomValue(makePlaceListAtom);

  const getItemNameById = (id: number) => {
    const itemInfo = makePlaceList.find((item) => item.id === id);
    return (itemInfo) ? itemInfo.name : id;
  }

  if (unresolvedItems.length === 0) {
    return null;
  }

  return (
    <InfoBox>
      <label className="tracking-wider">Unresolved items</label>
      <ul className="pt-2">
      {
        unresolvedItems.map((item) => <li key={item} className="font-semibold text-lg truncate max-w-72">{getItemNameById(item)}</li>)
      }
      </ul>
    </InfoBox>
  );
}

const PerItemCost = () => {
  const [hiddenItemIds, setHiddenItemIds] = useAtom(hiddenItemIdsAtom);
  const setHiddenItemIdsForFile = useSetAtom(hiddenItemIdsForFileAtom);
  const makeplaceFilename = useAtomValue(makePlaceFilenameAtom);
  const priceList = useAtomValue(priceListAtom);
  const [sortedData, setSortedData] = useState([...priceList]);
  const [sorting, setSorting] = useState({ field: 'cost', asc: false });
  const [displayHiddenItems, setDisplayHiddenItems] = useState(false);
  const sortingRef = useRef({ field: '', asc: false });
  const hiddenIds = hiddenItemIds[makeplaceFilename] || [];

  const toggleHidden = (id: number) => {
    const hiddenItemIdsCopy = [...hiddenIds]
    if (hiddenItemIdsCopy.includes(id)) {
      hiddenItemIdsCopy.splice(hiddenItemIdsCopy.findIndex((hiddenId) => hiddenId === id), 1);
    } else {
      hiddenItemIdsCopy.push(id);
    }
    setHiddenItemIds({...hiddenItemIds, ...{ [makeplaceFilename]: hiddenItemIdsCopy }});
  }

  const unHideAll = () => {
    setHiddenItemIds({...hiddenItemIds, ...{ [makeplaceFilename]: [] }});
  }

  useEffect(() => {
    setHiddenItemIdsForFile(hiddenItemIds[makeplaceFilename] || []);
  }, [hiddenItemIds, makeplaceFilename, setHiddenItemIdsForFile]);

  useEffect(() => {
    // Sort data
    if (JSON.stringify(sortingRef.current) !== JSON.stringify(sorting)) {
      sortingRef.current = { ...sorting };
      const newSortedData = [...sortedData];
      if (sorting.field === 'name') {
        newSortedData.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
      } else {
        newSortedData.sort((a, b) => {
          const costA = a.units.reduce((arr, curr) => arr + curr.pricePerUnit, 0);
          const costB = b.units.reduce((arr, curr) => arr + curr.pricePerUnit, 0);
          return costA - costB;
        });
      }
      setSortedData((sorting.asc) ? newSortedData : newSortedData.reverse());
    }
  }, [sortedData, sorting]);

  if (priceList.length === 0) {
    return null;
  }

  return (
    <div className="md:min-w-96">
      <label className="tracking-wider">Items & costs</label>
      <div className="flex justify-between text-sm font-medium pt-3 pb-2 text-slate-500">
        <label htmlFor="checkbox-show-hidden" className="select-none grid grid-flow-col gap-1 items-center cursor-pointer hover:text-slate-300">
          <div className="grid items-center justify-center">
            <input
              type="checkbox"
              id="checkbox-show-hidden"
              defaultChecked={displayHiddenItems}
              className="peer row-start-1 col-start-1 appearance-none w-4 h-4 border ring-transparent border-slate-600 rounded checked:bg-green-700 checked:border-0 forced-colors:appearance-auto"
              onChange={(evt) => setDisplayHiddenItems(evt.target.checked)}
            />
            <svg viewBox="0 0 14 14" fill="none" className="invisible peer-checked:visible row-start-1 col-start-1 stroke-white dark:text-violet-300 forced-colors:hidden">
              <path d="M3 8L6 11L11 3.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
          Hide deselected
        </label>
        <button className="hover:text-slate-300" onClick={() => unHideAll()}>Reset selection</button>
      </div>
      <table className="table-auto mt-4 w-full">
        <thead>
          <tr>
            <th className="text-left tracking-wider hover:text-slate-300 hover:cursor-pointer" onClick={() => setSorting({ field: 'name', asc: !sorting.asc })}>
              <div className="flex items-center">
                <FaSort />Name
              </div>
            </th>
            <th className="text-right tracking-wider hover:text-slate-300 hover:cursor-pointer" onClick={() => setSorting({ field: 'cost', asc: !sorting.asc })}>
              <div className="flex justify-end items-center">
                <FaSort />Cost
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            sortedData.map((item) => {
              const textDecoration = (hiddenIds.includes(item.id)) ? 'line-through opacity-60' : '';
              const totalCost = item.units.reduce((arr, curr) => arr + curr.pricePerUnit, 0);
              if(displayHiddenItems && hiddenIds.includes(item.id)) {
                return null;
              }
              return (
                <tr
                  key={item.id}
                  className="hover:cursor-pointer [&>*:nth-child(1)]:hover:text-slate-300 [&>*:nth-child(2)]:hover:text-green-600"
                  onClick={() => toggleHidden(item.id)}
                >
                  <td className="pt-3 w-full">
                    <div>
                      <div className={`text-lg font-semibold ${textDecoration}`}>{`${item.name}`}</div>
                      {
                        item.units.map((unit, idx) => (
                          <div key={idx} className={`flex justify-between text-sm ${textDecoration}`}>
                            <div className="text-slate-500">{unit.worldName}</div>
                            <div className="pr-2 text-green-800">{formatDisplayCost(unit.pricePerUnit)}</div>
                          </div>
                        ))
                      }
                    </div>
                  </td>
                  <td className={`pl-10 pt-3 text-right text-lg font-bold align-top text-green-700 ${textDecoration}`}>{formatDisplayCost(totalCost)}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

const CostSummary = () => {
  const priceList = useAtomValue(priceListAtom);

  if (priceList.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row space-x-6 pb-28">
      <InfoBox>
        <PerItemCost />
      </InfoBox>
      <div className="space-y-6">
        <TotalCost />
        <ItemCount />
        <UnresolvedItems />
      </div>
    </div>
  )
}

const Costs = () => {
  const setPriceList = useSetAtom(priceListAtom);
  const setUnresolvedItems = useSetAtom(unresolvedItemsAtom);
  const makePlaceList = useAtomValue(makePlaceListAtom);
  const selectedCenter = useAtomValue(selectedCenterAtom);
  const [isFetching, setIsFetching] = useState(false);

  const buildURL = useCallback((itemList: MakePlaceItem[]) => {
    let maxItemCount = 0;
    let url = 'https://universalis.app/api/v2/';
    url += `${selectedCenter.toLocaleLowerCase()}/`;
    itemList.forEach((item, idx) => {
      url += item.id + (idx < itemList.length-1 ? ',' : '');
      if (item.count > maxItemCount) {
        maxItemCount = item.count;
      }
    });
    url += '?' + new URLSearchParams({
      listings: maxItemCount + '',
      entries: '0',
      statsWithin: '0',
      entriesWithin: '0',
      fields: 'dcName,unresolvedItems,items.listings.pricePerUnit,items.listings.worldName,items.listings.tax',
    });
    return url;
  }, [selectedCenter]);

  useEffect(() => {
    // Fetch data for items if makeplace list is populated
    if (makePlaceList.length > 0) {
      setIsFetching(true);
      const MAX_ITEMS_PER_CALL = 100; // API supports maximum of 100 items per call
      const fetchCount = Math.ceil(makePlaceList.length / MAX_ITEMS_PER_CALL);
      const urls = [];
      for (let i = 0; i < fetchCount; i++) {
        urls.push(buildURL(makePlaceList.slice(i * MAX_ITEMS_PER_CALL, (i + 1) * MAX_ITEMS_PER_CALL)));
      }
      const requests = urls.map((url) => fetch(url));
      Promise.all(requests)
        .then((responses) => {
          const errors = responses.filter((res) => !res.ok);
          if (errors.length > 0) {
            throw errors.map((res) => Error(res.statusText));
          }
          const json = responses.map((res) => res.json());
          return Promise.all(json);
        })
        .then((data: ResponseObject[]) => {
          const combinedData: ResponseItem = {};
          let unresolvedItems: number[] = [];
          data.forEach((res) => {
            Object.assign(combinedData, res.items);
            if (res.unresolvedItems) {
              unresolvedItems = [...unresolvedItems, ...res.unresolvedItems];
            }
          });

          const parsedCosts: PriceListItem[] = [];
          for (const [key, value] of Object.entries(combinedData)) {
            const id = parseInt(key, 10);
            const makePlaceInfo = makePlaceList.find((item) => item.id === id);
            if (makePlaceInfo) {
              parsedCosts.push({
                id,
                name: makePlaceInfo.name,
                units: value.listings.slice(0, makePlaceInfo.count),
              });
            }
          }
          setPriceList(parsedCosts);
          setUnresolvedItems(unresolvedItems);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setIsFetching(false));
    }
  }, [makePlaceList, setPriceList, buildURL, setUnresolvedItems]);

  return (
    <>
      {
        isFetching
          ? <Loader />
          : <CostSummary />
      }
    </>
  );
}

export default Costs;