'use client'

import { useAtom, useAtomValue } from "jotai";
import Label from "./label";
import { hiddenItemIdsAtom, makePlaceFilenameAtom, makePlaceListAtom, optionsAtom, priceListAtom, selectedCenterAtom } from "../lib/jotai-store";
import { useEffect, useId, useState, useTransition } from "react";
import { createItemList } from "../actions";
import { LuCopy, LuLoader2, LuShare2 } from "react-icons/lu";

type OptionsProps = {
  showAdvanced?: boolean,
}

type CheckboxProps = {
  checked: boolean,
  toggle: (value: boolean) => void,
  children?: React.ReactNode,
}

const Checkbox = ({ checked, toggle, children }: CheckboxProps) => {
  const checkboxId = useId();
  return (
    <label htmlFor={checkboxId} className="select-none grid grid-flow-col gap-2 items-center cursor-pointer hover:text-slate-300">
      <div className="grid items-center justify-center">
        <input
          type="checkbox"
          id={checkboxId}
          defaultChecked={checked}
          className="peer row-start-1 col-start-1 appearance-none w-4 h-4 border ring-transparent border-slate-600 rounded checked:bg-green-700 checked:border-0 forced-colors:appearance-auto"
          onChange={(evt) => toggle(evt.target.checked)}
        />
        <svg viewBox="0 0 14 14" fill="none" className="invisible peer-checked:visible row-start-1 col-start-1 stroke-white dark:text-violet-300 forced-colors:hidden">
          <path d="M3 8L6 11L11 3.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </div>
      {children}
    </label>
  );
}

const Options = ({ showAdvanced }: OptionsProps) => {
  const [options, setOptions] = useAtom(optionsAtom);
  const [hiddenItemIds, setHiddenItemIds] = useAtom(hiddenItemIdsAtom);
  const makeplaceFilename = useAtomValue(makePlaceFilenameAtom);
  const selectedCenter = useAtomValue(selectedCenterAtom)
  const makePlaceList = useAtomValue(makePlaceListAtom);
  const priceList = useAtomValue(priceListAtom);
  const [isPending, startTransition] = useTransition();
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    setShareUrl('');
  }, [makePlaceList])

  if (priceList.length === 0) {
    return null;
  }

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

  const shareList = async () => {
    startTransition(async () => {
      const { key, error } = await createItemList({
        key: '',
        dataCenter: selectedCenter,
        items: makePlaceList,
      });
      if (error) {
        console.error(error);
      } else {
        setShareUrl(`${window.location.href}${key}` || '');
      }
    })
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
  }
 
  return (
    <div className="w-full lg:w-[50rem]">
      <Label>Options</Label>
      <div className="flex flex-col bg-slate-800 px-8 py-4 gap-4 rounded-md h-fit text-sm font-medium text-slate-500">
        <div className="flex justify-between">
          <div className="flex gap-8">
            <Checkbox checked={options.includeTax} toggle={setIncludeTax}>Include tax</Checkbox>
            <Checkbox checked={options.hideDeselected} toggle={setHideDeselected}>Hide excluded items</Checkbox>
          </div>
          <div className="flex gap-8">
            <button className="hover:text-slate-300" onClick={() => resetItemSelection()}>Reset item selection</button>
            {
              showAdvanced && 
                <button className="hover:text-slate-300 disabled:text-slate-600 flex items-center gap-1" disabled={shareUrl !== '' || isPending} onClick={shareList}>
                  { (isPending === false) ? <LuShare2 fontSize={'larger'} /> : <LuLoader2 className="animate-spin" fontSize='larger' /> }
                  Share
                </button>
            }
          </div>
        </div>
        {
          shareUrl &&
            <div className="flex flex-col md:flex-row justify-end items-center gap-3">
              <Label>Sharable link:</Label>
              <p className="font-normal text-sm text-slate-600 bg-slate-900 px-3 py-1 rounded">{shareUrl}</p>
              <button className="hover:text-slate-300 flex gap-1" onClick={copyToClipboard}><LuCopy fontSize='large' /> Copy link</button>
            </div>
        }
      </div>
    </div>
  );
}

export default Options;