import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { DataCenter, HiddenItems, MakePlaceItem, PriceListItem } from "./types";


export const dataCentersAtom = atom([] as DataCenter[]);

export const selectedCenterAtom = atomWithStorage('dataCenter', 'Elemental');

export const hiddenItemIdsAtom = atomWithStorage('hiddenItems', {} as HiddenItems, createJSONStorage());

export const hiddenItemIdsForFileAtom = atom([] as number[]);

export const makePlaceFilenameAtom = atom('');

export const makePlaceListAtom = atom([] as MakePlaceItem[]);

export const priceListAtom = atom([] as PriceListItem[]);

export const unresolvedItemsAtom = atom([] as number[]);

export const optionsAtom = atom({ includeTax: true, hideDeselected: false });
