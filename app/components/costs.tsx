'use client'

import { useAtomValue, useSetAtom } from "jotai";
import { priceListAtom, itemIdsAtom, makePlaceListAtom, selectedCenterAtom } from "../lib/jotai-store";
import { Suspense, useEffect, useState } from "react";
import { MakePlaceItem, PriceListItem } from "../lib/types";

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
    const combinedCostForUnits = curr.units.reduce((arr2, curr2) => arr2 + curr2.pricePerUnit, 0);
    return arr + combinedCostForUnits;
  }, 0);

  return (
    <>
      <p>{`Total cost: ${formatDisplayCost(totalCost)}`}</p>
    </>
  );
}

const PerItemCost = () => {
  const priceList = useAtomValue(priceListAtom);

  if (priceList.length === 0) {
    return null;
  }

  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th className="text-left">Name</th>
          <th className="text-right">Cost</th>
        </tr>
      </thead>
      <tbody>
        {
          priceList.map((item) => {
            const totalCost = item.units.reduce((arr, curr) => arr + curr.pricePerUnit, 0);
            return (
              <tr key={item.id} className="hover:text-slate-300">
                <td className="pt-3">
                  <div>
                    <div className="text-lg font-medium">{`${item.name}`}</div>
                    {
                      item.units.map((unit, idx) => (
                        <div key={idx} className="flex justify-between text-slate-500 text-sm">
                          <div>{unit.worldName}</div>
                          <div className="pr-2">{formatDisplayCost(unit.pricePerUnit)}</div>
                        </div>
                      ))
                    }
                  </div>
                </td>
                <td className="pl-10 pt-3 text-right text-lg font-semibold align-top">{formatDisplayCost(totalCost)}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
  )
}

const InfoBox = ({children}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="bg-slate-950 p-8 rounded-3xl h-fit">
      {children}
    </div>
  )
}

const CostSummary = () => {
  const priceList = useAtomValue(priceListAtom);

  if (priceList.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row space-x-6">
      <InfoBox>
        <PerItemCost />
      </InfoBox>
      <InfoBox>
        <TotalCost />
      </InfoBox>
    </div>
  )
}

const Costs = () => {
  const setPriceList = useSetAtom(priceListAtom);
  const makePlaceList = useAtomValue(makePlaceListAtom);
  const selectedCenter = useAtomValue(selectedCenterAtom);
  const itemIds = useAtomValue(itemIdsAtom);
  const [isFetching, setIsFetching] = useState(false);

  const buildURL = (itemList: MakePlaceItem[]) => {
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
  }

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
          data.forEach((res) => Object.assign(combinedData, res.items));

          const parsedCosts: PriceListItem[] = [];
          for (const [key, value] of Object.entries(combinedData)) {
            const itemInfo = itemIds.find((item) => item.id === key);
            const makePlaceInfo = makePlaceList.find((item) => item.id === key);
            parsedCosts.push({
              id: key,
              name: itemInfo?.en || 'Unknown',
              units: value.listings.slice(0, makePlaceInfo?.count),
            });
          }
          setPriceList(parsedCosts);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => setIsFetching(false));
    }
  }, [makePlaceList]);

  return (
    <>
      <div>
        <p>{`${makePlaceList.length} furniture items in list.`}</p>
      </div>
      {
        isFetching
          ? <h1>Loading costs....</h1>
          : <CostSummary />
      }
    </>
  );
}

export default Costs;