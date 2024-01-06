/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useCallback } from 'react';
import CsvDownloadButton from 'react-json-to-csv';

import { useNodeDispatch, useNodeSelector } from '../store/hooks';
import { changeShowResults } from '../store/nodeSlice';

import DataOperationUtils from '../utils/DataOperationUtils';

import { NodeStateType } from '../types/nodeReducer';

function ResultPanel() {
  const [data, setData] = useState<Array<any>>([]);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const showResults = useNodeSelector((state) => state.node.showResults);
  const currentNode = useNodeSelector((state) => state.node.currentNode);
  const fileDataArr = useNodeSelector((state) => state.node.filesDataArr);
  const nodeArr = useNodeSelector((state) => state.node.nodeStateArr);
  const edges = useNodeSelector((state) => state.node.edges);
  const nodeDispatch = useNodeDispatch();

  const calculateResultFromOperations = useCallback((x: NodeStateType) => DataOperationUtils.applyFunctionToData({
    methodName: x.methodName!,
    currentNode: x,
    filesData: fileDataArr,
    edges,
    nodeArr,
  }), [fileDataArr, nodeArr, edges]);

  useEffect(() => {
    if (currentNode) {
      setData(calculateResultFromOperations(currentNode!));
    }
  }, [currentNode, calculateResultFromOperations]);

  useEffect(() => {
    if (data.length) {
      setColumnNames(Object.keys((data[0])));
    }
  }, [data]);

  if (showResults) {
    return (
      <div className="z-10 bg-red-500 absolute bottom-0 w-[100%] h-[40%] overflow-x-scroll overflow-y-scroll">
        <CsvDownloadButton
          data={data}
          style={{
            position: 'sticky',
            top: '5px',
            left: '5vw',
            color: 'white',
            fontWeight: 600,
          }}
        >
          Export Data
        </CsvDownloadButton>
        <button className="text-white sticky top-[5px] left-[95vw] font-bold" onClick={() => nodeDispatch(changeShowResults({ x: false }))}>X</button>
        <table className="w-[100%] text-center mt-10">
          <thead>
            <tr>
              {columnNames.map((cname, index) => (
                <td key={index} className="font-bold">{cname}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {
              data.map((row, index) => (
                <tr key={index}>
                  {
                    columnNames.map((cname, i) => (
                      <td key={i}>{row[cname]}</td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

export default ResultPanel;
