export type DataCenter = {
  name: string,
  region: string,
  worlds: number[],
}

export type MakePlaceItem = {
  id: number,
  name: string,
  count: number
}

export type PriceListItem = {
  id: number,
  name: string,
  units: {
    pricePerUnit: number,
    worldName: string,
    tax: number,
  }[],
}

export type HiddenItems = {
  [key: string]: number[],
}
