'use server'

import { MongoClient } from "mongodb";
import { nanoid } from "nanoid";
import { MakePlaceItem } from "./lib/types";

export type ItemList = {
  key: string;
  dataCenter: string;
  items: MakePlaceItem[];
}

export const createItemList = async (itemList: ItemList) => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db('makeplace');
    const collection = db.collection<ItemList>('itemlists');
    
    const key = nanoid(10);
    itemList.key = key;
    await collection.insertOne(itemList);
    
    await client.close();
    return { key };
  } catch (error) {
    console.error(error);
    return { key: null, error } ;
  }
}

export const findItemList = async (key: string) => {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db('makeplace');
    const collection = db.collection<ItemList>('itemlists');

    const itemList = await collection.findOne<ItemList>(
      { key },
      {
        projection: { _id: 0, key: 1, dataCenter: 1, items: 1 }
      }
    );
    await client.close();
    return itemList;
  } catch (error) {
    console.error(error)
    return null;
  }
}