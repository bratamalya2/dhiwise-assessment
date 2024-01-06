import React, {
  useState, useCallback, FormEvent, useEffect,
} from 'react';
import Papa from 'papaparse';

import { useNodeDispatch } from '../store/hooks';
import {
  addFile, addData, initFunction, saveCurrentWorkflow,
} from '../store/nodeSlice';

import { MethodType } from '../types/methodTypes';

import functions from '../data/functions';

export default function LeftPanel() {
  const nodeDispatch = useNodeDispatch();

  const addFileToFlowFunc = (fileName: string, filePath: string) => {
    nodeDispatch(addFile({ fileName, filePath, positionX: window.innerWidth * 0.15 }));
  };

  const initActionToFlowFunc = (methodName: MethodType) => {
    nodeDispatch(initFunction({ methodName, positionX: window.innerWidth * 0.15 }));
  };

  const addDataFunc = (data: Array<object>, fileName: string, columnNames: Array<string>) => {
    nodeDispatch(addData({
      data,
      fileName,
      columnNames,
    }));
  };

  const changeHandler = (event: FormEvent<HTMLInputElement>) => {
    if ((event.target as HTMLInputElement).files!.length === 0) { return; }
    Papa.parse((event.target as HTMLInputElement).files![0], {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        const columnNames = Object.keys(JSON.parse(JSON.stringify(results.data[0])));
        addDataFunc(JSON.parse(JSON.stringify((results.data))), (event.target as HTMLInputElement).files![0].name, columnNames);
        addFileToFlowFunc((event.target as HTMLInputElement).files![0].name, `../data/${(event.target as HTMLInputElement).files![0].name}`);
      },
    });
  };

  return (
    <aside className="w-[25vw] bg-yellow-500 py-6">
      <div className="my-5 mx-auto w-fit">
        <button className="text-white p-3 rounded bg-blue-700 font-bold" onClick={() => nodeDispatch(saveCurrentWorkflow({ x: true }))}>Save Workflow</button>
      </div>
      <div className="my-3">
        <p className="text-xl font-bold text-red-500 text-center mb-5">Add a file</p>
        <div className="mx-auto">
          <input
            type="file"
            name="file"
            accept=".csv"
            onInput={(e) => changeHandler(e)}
            style={{ display: 'block', margin: '10px auto' }}
          />
        </div>
      </div>
      <div className="my-3">
        <p className="text-xl font-bold text-red-500 text-center mb-5">Functions</p>
        {
          functions.map((f, index) => (
            <div key={index} className="cursor-pointer bg-blue-700 text-white mx-auto w-fit px-4 rounded my-4" onClick={() => initActionToFlowFunc(f.functionName)}>
              Function Name:
              {' '}
              {f.functionName}
            </div>
          ))
        }
      </div>
    </aside>
  );
}
