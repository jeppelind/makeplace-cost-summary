'use client'

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { priceListAtom, itemIdsAtom, makePlaceListAtom, selectedCenterAtom, unresolvedItemsAtom } from "../lib/jotai-store";
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

  const totalCost = priceList.reduce((arr, curr) => {
    const combinedCostForUnits = (curr.isHidden) ? 0 : curr.units.reduce((arr2, curr2) => arr2 + curr2.pricePerUnit, 0);
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
  const itemCount = priceList.reduce((acc, curr) => acc + (curr.isHidden ? 0 : curr.units.length), 0);

  return (
    <InfoBox>
      <label className="tracking-wider">Item count</label>
      <h1 className="text-3xl font-extrabold text-center">{itemCount}</h1>
    </InfoBox>
  );
}

const UnresolvedItems = () => {
  const unresolvedItems = useAtomValue(unresolvedItemsAtom);
  const itemIds = useAtomValue(itemIdsAtom);

  const getItemNameById = (id: string) => {
    const itemId = id.toString();
    const itemInfo = itemIds.find((item) => item.id === itemId);
    return (itemInfo) ? itemInfo.en : id;
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
  const [priceList, setPriceList] = useAtom(priceListAtom);
  const [sortedData, setSortedData] = useState([...priceList]);
  const [sorting, setSorting] = useState({ field: 'cost', asc: false });
  let sortingRef = useRef({ field: '', asc: false });

  const toggleHidden = (id: string) => {
    const priceListCopy = [...priceList];
    const item = priceListCopy.find((item) => item.id === id);
    if (item) {
      item.isHidden = !item.isHidden;
      setPriceList([...priceListCopy]);
    }
  }

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
    <>
      <label className="tracking-wider">Items & costs</label>
      <table className="table-auto mt-4">
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
              const textDecoration = (item.isHidden) ? 'line-through opacity-60' : '';
              const totalCost = item.units.reduce((arr, curr) => arr + curr.pricePerUnit, 0);
              return (
                <tr
                  key={item.id}
                  className="hover:cursor-pointer [&>*:nth-child(1)]:hover:text-slate-300 [&>*:nth-child(2)]:hover:text-green-600"
                  onClick={() => toggleHidden(item.id)}
                >
                  <td className="pt-3">
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
    </>
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
  const itemIds = useAtomValue(itemIdsAtom);
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
      fields: 'dcName,unresolvedItems,items.listings.pricePerUnit,items.listings.worldName',
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
          let unresolvedItems: string[] = [];
          data.forEach((res) => {
            Object.assign(combinedData, res.items);
            if (res.unresolvedItems) {
              unresolvedItems = [...unresolvedItems, ...res.unresolvedItems];
            }
          });

          const parsedCosts: PriceListItem[] = [];
          for (const [key, value] of Object.entries(combinedData)) {
            const itemInfo = itemIds.find((item) => item.id === key);
            const makePlaceInfo = makePlaceList.find((item) => item.id === key);
            parsedCosts.push({
              id: key,
              name: itemInfo?.en || 'Unknown',
              units: value.listings.slice(0, makePlaceInfo?.count),
              isHidden: false,
            });
          }
          setPriceList(parsedCosts);
          setUnresolvedItems(unresolvedItems);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setIsFetching(false));
    }
  }, [makePlaceList, itemIds, setPriceList, buildURL, setUnresolvedItems]);

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