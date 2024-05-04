'use client'

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { DataCenter, MakePlaceItem } from "../lib/types";
import { useHydrateAtoms } from "jotai/utils";
import { dataCentersAtom, makePlaceFilenameAtom, makePlaceListAtom, selectedCenterAtom } from "../lib/jotai-store";
import Label from "./label";
import { LuFileText } from "react-icons/lu";
import { useRef } from "react";

type FileSelecterProps = {
  dataCentersFromServer: DataCenter[],
}

type ItemIdsFetchResonse = {
	Pagination: {
		Page: number,
		PageTotal: number,
		Results: number,
		ResultsPerPage: number,
		ResultsTotal: number
	},
	Results: [
		{
			ID: number,
			Name: string
		}
	],
	SpeedMs: number
}

const DataCenterDropdown = () => {
  const dataCenters = useAtomValue(dataCentersAtom);
  const [selectedCenter, setSelectedCenter] = useAtom(selectedCenterAtom);
  const validDataCenters = useRef(dataCenters.filter((center) => !center.worlds.some((id) => id > 1000)));

  return (
    <div className="flex flex-col">
      <Label>Data center</Label>
      <select name="data center" value={selectedCenter} onChange={(evt) => setSelectedCenter(evt.target.value)}
        className="p-4 dark:bg-slate-700 hover:text-slate-300 hover:cursor-pointer rounded-md grow">
        {
          validDataCenters.current.map((center) => {
            return <option key={center.name} value={center.name}>{center.name}</option>
          })
        }
      </select>
    </div>
  )
}

const FileInput = () => {
  const setMakePlaceList = useSetAtom(makePlaceListAtom);
  const setMakePlaceFilename = useSetAtom(makePlaceFilenameAtom);

  const parseFurnitureFromText = (text: string) => {
    const result: MakePlaceItem[] = [];
    const lines = text.split(/[\r\n]+/g);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(':')) {
        const values = line.split(':');
        result.push({ id: 0, name: values[0], count: parseInt(values[1]) });
      }
      else if (line.includes('  Dyes  ')) { // End when reaching "Dyes"
        return result;
      }
    }
    return result;
  }

  const getElasticSearchQuery = (parsedList: MakePlaceItem[]) => {
    return {
      indexes: "item",
      columns: "ID,Name",
      body: {
        query: {
          bool: {
            should: parsedList.map((item) => ({ match: { Name_en: item.name } }))
          }
        },
        from: 0,
        size: 200
      }
    }
  }

  const fetchItemIds = (parsedMakePlaceList: MakePlaceItem[]) => {
    return fetch('https://xivapi.com/search', {
      method: 'POST',
      body: JSON.stringify(getElasticSearchQuery(parsedMakePlaceList)),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data: ItemIdsFetchResonse) => {
        data.Results.forEach((result) => {
          const idx = parsedMakePlaceList.findIndex((item) => item.name === result.Name);
          if (idx !== -1) {
            parsedMakePlaceList[idx].id = result.ID;
          }
        });
        return parsedMakePlaceList;
      });
  }

  const readFiles = (files: FileList) => {
    const file = files.item(0);
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        if (reader.result) {
          const parsedMakePlaceList = parseFurnitureFromText(reader.result as string);
          fetchItemIds(parsedMakePlaceList)
            .then((parsedMakePlaceListWithIds) => {
              setMakePlaceList(parsedMakePlaceListWithIds);
              setMakePlaceFilename(file.name);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }
  }

  return (
    <div className="flex flex-col">
      <Label>MakePlace file</Label>
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
        <LuFileText className="text-xl" />Select a MakePlace file
      </label>
    </div>
  )
}

const FileSelecter = ({ dataCentersFromServer }: FileSelecterProps) => {
  useHydrateAtoms([
    [dataCentersAtom, dataCentersFromServer]
  ]);

  return (
    <div>
      <div className="flex flex-row justify-center gap-2">
        <DataCenterDropdown />
        <FileInput />
      </div>
      <p className="text-sm text-slate-500 pt-4">
        <span className="font-bold">Instructions:</span> Select a MakePlace save file (located in the folder &quot;../MakePlace/Save/&quot; by default).<br />
        Once the items are loaded below you can toggle whether they should be included in the total cost by clicking on them.<br />
        Problems? Blame Totono.
      </p>
    </div>
  );
}

export default FileSelecter;