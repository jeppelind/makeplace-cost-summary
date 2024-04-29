export type DataCenter = {
  name: string,
  region: string,
  worlds: number[],
}

export type ItemId = {
  id: string,
  en: string,
}

export type MakePlaceItem = {
  id: string,
  name: string,
  count: number
}

export type PriceListItem = {
  id: string,
  name: string,
  units: {
    pricePerUnit: number,
    worldName: string,
  }[],
  isHidden: boolean,
}
