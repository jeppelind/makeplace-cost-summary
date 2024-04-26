'use client'

import { atom, useAtom, useAtomValue } from "jotai";
import { DataCenter, ItemId } from "../types";
import { atomWithStorage, useHydrateAtoms } from "jotai/utils";

type FileUploaderProps = {
  dataCentersFromServer: DataCenter[],
  itemIdsFromServer: ItemId[],
}

type MakePlaceList = {
  maxCount: number,
  furniture: {
    id: number,
    name: string,
    count: number
  }[],
}

const dataCentersAtom = atom([] as DataCenter[]);
const selectedCenterAtom = atomWithStorage('dataCenter', '');
const itemIdsAtom = atom([] as ItemId[]);

const DataCenterDropdown = () => {
  const dataCenters = useAtomValue(dataCentersAtom);
  const [selectedCenter, setSelectedCenter] = useAtom(selectedCenterAtom);

  return (
    <select name="data center" value={selectedCenter} onChange={(evt) => setSelectedCenter(evt.target.value)}
      className="p-3 accent-pink-500 bg-slate-300 dark:bg-slate-700 rounded-md">
      {
        dataCenters.map((center) => {
          if (center.worlds.some((id) => id > 1000)) {
            return null;
          }
          return <option key={center.name} value={center.name}>{center.name}</option>
        })
      }
    </select>
  )
}

const FileInput = () => {
  const itemIds = useAtomValue(itemIdsAtom);

  const parseFurnitureFromText = (text: string) => {
    const result: MakePlaceList = { maxCount: 0, furniture: [] };
    const lines = text.split(/[\r\n]+/g);
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(':')) {
        const values = line.split(':');
        const count = parseInt(values[1]);
        const item = itemIds.find((item) => item.en === values[0]);
        if (item) {
          result.furniture.push({ count, id: item.id, name: values[0] });
          if (count > result.maxCount) {
            result.maxCount = count;
          }
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
        }
      }
    }
  }

  return (
    <>
      <input
        id="makeplace-input"
        className="makeplace-file-input"
        type="file"
        name="makeplace file"
        accept=".list.txt"
        onChange={(evt) => {
          console.log('MEPP')
          if (evt.target.files) {
            readFiles(evt.target.files);
            evt.target.value = '';
          }
        }}
      />
      <label htmlFor="makeplace-input" className="p-3 px-6 bg-slate-300 dark:bg-slate-700 rounded-md">Select a file</label>
    </>
  )
}

const FileUploader = ({ dataCentersFromServer, itemIdsFromServer }: FileUploaderProps) => {
  useHydrateAtoms([
    [dataCentersAtom, dataCentersFromServer],
    [itemIdsAtom, itemIdsFromServer],
  ]);

  return (
    <>
      <p>Upload</p>
      <div className="flex flex-row gap-2">
        <DataCenterDropdown />
        <FileInput />
      </div>
    </>
  );
}

export default FileUploader;