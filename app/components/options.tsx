'use client'

import { useAtom, useAtomValue } from "jotai";
import Label from "./label";
import { hiddenItemIdsAtom, makePlaceFilenameAtom, optionsAtom } from "../lib/jotai-store";

const Options = () => {
  const [options, setOptions] = useAtom(optionsAtom);
  const [hiddenItemIds, setHiddenItemIds] = useAtom(hiddenItemIdsAtom);
  const makeplaceFilename = useAtomValue(makePlaceFilenameAtom);

  const setIncludeTax = (value: boolean) => {
    const newOptions = { ...options };
    newOptions.includeTax = value;
    setOptions(newOptions);
  };

  const setHideDeselected = (value: boolean) => {
    const newOptions = { ...options };
    newOptions.hideDeselected = value;
    setOptions(newOptions);
  };

  const resetItemSelection = () => {
    setHiddenItemIds({...hiddenItemIds, ...{ [makeplaceFilename]: [] }});
  };
 
  return (
    <div className="w-full lg:w-[50rem]">
      <Label>Options</Label>
      <div className="flex justify-between bg-slate-800 px-8 py-4 rounded-md h-fit text-sm font-medium text-slate-500">
        <div className="flex gap-8">
          <label htmlFor="checkbox-include-tax" className="select-none grid grid-flow-col gap-2 items-center cursor-pointer hover:text-slate-300">
            <div className="grid items-center justify-center">
              <input
                type="checkbox"
                id="checkbox-include-tax"
                defaultChecked={options.includeTax}
                className="peer row-start-1 col-start-1 appearance-none w-4 h-4 border ring-transparent border-slate-600 rounded checked:bg-green-700 checked:border-0 forced-colors:appearance-auto"
                onChange={(evt) => setIncludeTax(evt.target.checked)}
              />
              <svg viewBox="0 0 14 14" fill="none" className="invisible peer-checked:visible row-start-1 col-start-1 stroke-white dark:text-violet-300 forced-colors:hidden">
                <path d="M3 8L6 11L11 3.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            Include tax
          </label>
          <label htmlFor="checkbox-show-hidden" className="select-none grid grid-flow-col gap-1 items-center cursor-pointer hover:text-slate-300">
            <div className="grid items-center justify-center">
              <input
                type="checkbox"
                id="checkbox-show-hidden"
                defaultChecked={options.hideDeselected}
                className="peer row-start-1 col-start-1 appearance-none w-4 h-4 border ring-transparent border-slate-600 rounded checked:bg-green-700 checked:border-0 forced-colors:appearance-auto"
                onChange={(evt) => setHideDeselected(evt.target.checked)}
              />
              <svg viewBox="0 0 14 14" fill="none" className="invisible peer-checked:visible row-start-1 col-start-1 stroke-white dark:text-violet-300 forced-colors:hidden">
                <path d="M3 8L6 11L11 3.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            Hide excluded items
          </label>
        </div>
        <button className="hover:text-slate-300" onClick={() => resetItemSelection()}>Reset item selection</button>
      </div>
    </div>
  );
}

export default Options;