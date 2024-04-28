'use client'

import { useEffect, useState } from "react";
import { DataCenter } from "./lib/types";

type DataCenterProps = {
  dataCenters: DataCenter[],
}

const DataCenterDropdown = ({ dataCenters }: DataCenterProps) => {
  const [selectedDC, setSelectedDC] = useState('');

  useEffect(() => {
    const storedValue = localStorage.getItem('DATA_CENTER') || '';
    setSelectedDC(storedValue);
  }, []);

  useEffect(() => {
    if (selectedDC !== '') {
      localStorage.setItem('DATA_CENTER', selectedDC)
    }
  }, [selectedDC]);

  const muppson = (files: FileList | null) => {
    console.log(files)
    if (files) {
      const file = files.item(0);
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          console.log('Done.')
          console.log(reader.result);
        }
      }
    }
    
  }

  return (
    <div>
      <p>Data Center</p>
      <select id="dc-select" name="data center" value={selectedDC} onChange={evt => setSelectedDC(evt.target.value)}
        className="p-3 accent-pink-500 bg-slate-300 dark:bg-slate-700 rounded-md">
        {
          dataCenters.map((dataCenter) => {
            if (dataCenter.worlds.some((id) => id > 1000)) {
              return null;
            }
            return <option key={dataCenter.name} value={dataCenter.name}>{dataCenter.name}</option>
          })
        }
      </select>
      <p>Makeplace list</p>
      <input type="file" id="makeplace-file" name="makeplace file" accept=".list.txt" onChange={evt => muppson(evt.target.files)} />
    </div>
  )
}

const FileInput = () => {
  return (
    <div>
      <p>Makeplace list</p>
      <input type="file" name="makeplace list" accept=".list.txt" />
    </div>
  )
}

const PricesPage = ({ dataCenters }: DataCenterProps) => {
  return (
    <div>
      <DataCenterDropdown dataCenters={dataCenters} />
    </div>
  );
}

export default PricesPage;
