/* eslint-disable no-console */
import React, { useState, FormEvent } from 'react';
import { Edge } from 'reactflow';

import {
  changeShowResults, changeCurrentNode, sort, filter,
} from '../store/nodeSlice';
import { useNodeDispatch, useNodeSelector } from '../store/hooks';

import DataOperationUtils from '../utils/DataOperationUtils';

import { NodeStateType } from '../types/nodeReducer';
import { FileDataType } from '../types/fileDataTypes';
import { OrderType } from '../types/orderTypes';
import { ConditionTypes } from '../types/conditionTypes';

function FunctionLabel({ elem, filesDataArr, edges }: {
  elem: NodeStateType; filesDataArr: FileDataType[]; edges: Edge[]
}) {
  const [modify, setModify] = useState(false);
  const [currentColumnName, setCurrentColumnName] = useState<string>('');
  const [currentSortOrder, setCurrentSortOrder] = useState<OrderType>('asc');
  const [currentCondition, setCurrentCondition] = useState<ConditionTypes>('eq');
  const [currentValue, setCurrentValue] = useState<number | string>(0);
  const nodeArr = useNodeSelector((state) => state.node.nodeStateArr);
  const nodeDispatch = useNodeDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setModify(false);
    switch (elem.methodName) {
      case 'filter':
        nodeDispatch(filter({
          id: elem.id,
          columnName: currentColumnName,
          condition: currentCondition,
          value: currentValue,
        }));
        break;
      case 'sort':
        nodeDispatch(
          sort({ id: elem.id, columnName: currentColumnName, orderType: currentSortOrder }),
        );
        break;
      default:
        console.log('Error');
    }
  };

  if (!modify) {
    return (
      <div>
        <p>
          Method name:
          {elem.methodName}
        </p>
        <p>
          Column name:
          {elem.columnName!.length > 0 ? elem.columnName : (
            <span className="font-bold text-red-500">
              {
                currentColumnName
              }
            </span>
          )}
        </p>
        {elem.methodName === 'sort' && (
          <p>
            Sort Order:
            {elem.orderType === 'asc' ? 'Ascending' : 'Descending'}
          </p>
        )}
        {elem.methodName === 'filter' && (
          <>
            <p>
              Condition:
              {elem.condition}
            </p>
            <p>
              Value:
              {elem.value}
            </p>
          </>
        )}
        <button className="bg-emerald-500 text-white p-2 rounded my-2 mr-5" onClick={() => setModify(true)}>Modify</button>
        {
          currentColumnName.length > 0 && (
            <button
              className="bg-green-600 text-white p-2 rounded my-2"
              onClick={(e) => {
                e.stopPropagation();
                nodeDispatch(changeShowResults({ x: true }));
                nodeDispatch(changeCurrentNode({ x: elem }));
              }}
            >
              Run
            </button>
          )
        }
      </div>
    );
  }
  return (
    <div>
      <p>
        Method name:
        {elem.methodName}
      </p>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="my-4">
          <label htmlFor="column-name">Choose a column:</label>
          <select name="column-name" id="column-name" onChange={(e) => setCurrentColumnName(e.target.value)}>
            {DataOperationUtils.getColumnNames({
              node: elem, edges, nodeArr, filesDataArr,
            }).map((colName, i) => (
              <option key={i} value={colName}>{colName}</option>
            ))}
          </select>
        </div>
        {elem.methodName === 'sort' && (
          <div className="my-4">
            <label htmlFor="sort-order">Choose a sort order:</label>
            <select name="sort-order" id="sort-order" onChange={(e) => setCurrentSortOrder(e.target.value as OrderType)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        )}
        {elem.methodName === 'filter' && (
          <>
            <div className="my-4">
              <label htmlFor="condition">Choose a sort order:</label>
              <select name="condition" id="condition" onChange={(e) => setCurrentCondition(e.target.value as ConditionTypes)}>
                <option value="eq">Equals</option>
                <option value="neq">Not equals</option>
                <option value="gt">Greater than</option>
                <option value="lt">Less than</option>
                <option value="includes">Includes</option>
                <option value="notincludes">Not includes</option>
              </select>
            </div>
            <div className="my-4">
              <label htmlFor="value">Enter a value:</label>
              <input type="text" onChange={(e) => setCurrentValue(e.target.value)} />
            </div>
          </>
        )}
        <button className="p-3 bg-emerald-500 text-white rounded">Finalize</button>
      </form>
    </div>
  );
}

export default FunctionLabel;
