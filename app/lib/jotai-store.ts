import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { DataCenter, ItemId, MakePlaceItem, PriceListItem } from "./types";


export const dataCentersAtom = atom([] as DataCenter[]);

export const selectedCenterAtom = atomWithStorage('dataCenter', '');

export const itemIdsAtom = atom([] as ItemId[]);

export const makePlaceListAtom = atom([] as MakePlaceItem[]);

export const priceListAtom = atom([] as PriceListItem[]);

export const unresolvedItemsAtom = atom([] as string[]);
