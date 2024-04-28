'use client'

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DataCenter, ItemId, MakePlaceItem } from "../lib/types";
import { useHydrateAtoms } from "jotai/utils";
import { dataCentersAtom, itemIdsAtom, makePlaceListAtom, selectedCenterAtom } from "../lib/jotai-store";
import Label from "./label";
import { LuFile, LuFileText } from "react-icons/lu";

type FileSelecterProps = {
  dataCentersFromServer: DataCenter[],
  itemIdsFromServer: ItemId[],
}

const DataCenterDropdown = () => {
  const dataCenters = useAtomValue(dataCentersAtom);
  const [selectedCenter, setSelectedCenter] = useAtom(selectedCenterAtom);

  return (
    <div className="flex flex-col">
      <Label>Data center</Label>
      <select name="data center" value={selectedCenter} onChange={(evt) => setSelectedCenter(evt.target.value)}
        className="p-4 dark:bg-slate-700 hover:text-slate-300 hover:cursor-pointer rounded-md grow">
        {
          dataCenters.map((center) => {
            if (center.worlds.some((id) => id > 1000)) {
              return null;
            }
            return <option key={center.name} value={center.name}>{center.name}</option>
          })
        }
      </select>
    </div>
  )
}

const FileInput = () => {
  const itemIds = useAtomValue(itemIdsAtom);
  const setMakePlaceList = useSetAtom(makePlaceListAtom);

  const parseFurnitureFromText = (text: string) => {
    const result: MakePlaceItem[] = [];
    const lines = text.split(/[\r\n]+/g);
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(':')) {
        const values = line.split(':');
        const count = parseInt(values[1]);
        const item = itemIds.find((item) => item.en === values[0]);
        if (item) {
          result.push({ count, id: item.id, name: values[0] });
        }
      }
      else if (line.includes('  Dyes  ')) { // End when reaching "Dyes"
        return result;
      }
    }
    return result;
  }

  const readFiles = (files: FileList) => {
    const file = files.item(0);
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        if (reader.result) {
          const parsedList = parseFurnitureFromText(reader.result as string);
          console.dir(parsedList)
          setMakePlaceList(parsedList);
        }
      }
    }
  }

  return (
    <div className="flex flex-col">
      <Label>File</Label>
      <input
        id="makeplace-input"
        className="makeplace-file-input"
        type="file"
        name="makeplace file"
        accept=".list.txt"
        onChange={(evt) => {
          if (evt.target.files) {
            readFiles(evt.target.files);
            evt.target.value = '';
          }
        }}
      />
      <label htmlFor="makeplace-input" className="flex items-center gap-2 p-4 px-6 dark:bg-slate-700 hover:text-slate-300 rounded-md">
        <LuFile className="text-xl" />Select a File
      </label>
    </div>
  )
}

const FileSelecter = ({ dataCentersFromServer, itemIdsFromServer }: FileSelecterProps) => {
  useHydrateAtoms([
    [dataCentersAtom, dataCentersFromServer],
    [itemIdsAtom, itemIdsFromServer],
  ]);

  return (
    <>
      <div className="flex flex-row gap-2">
        <DataCenterDropdown />
        <FileInput />
      </div>
    </>
  );
}

export default FileSelecter;