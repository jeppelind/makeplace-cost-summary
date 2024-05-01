import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { DataCenter, HiddenItems, ItemId, MakePlaceItem, PriceListItem } from "./types";


export const dataCentersAtom = atom([] as DataCenter[]);

export const selectedCenterAtom = atomWithStorage('dataCenter', 'Elemental');

export const itemIdsAtom = atom([] as ItemId[]);

export const hiddenItemIdsAtom = atomWithStorage('hiddenItems', {} as HiddenItems, createJSONStorage());

export const hiddenItemIdsForFileAtom = atom([] as string[]);

export const makePlaceFilenameAtom = atom('');

export const makePlaceListAtom = atom([] as MakePlaceItem[]);

export const priceListAtom = atom([] as PriceListItem[]);

export const unresolvedItemsAtom = atom([] as string[]);
