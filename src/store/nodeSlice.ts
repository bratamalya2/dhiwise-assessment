/* eslint-disable no-param-reassign */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { Edge } from 'reactflow';
import { NodeStateType } from '../types/nodeReducer';
import { NodeType } from '../types/nodeTypes';
import { OrderType } from '../types/orderTypes';
import { MethodType } from '../types/methodTypes';
import { ConditionTypes } from '../types/conditionTypes';
import { FileDataType } from '../types/fileDataTypes';
import { ActionType } from '../types/actionTypes';

const initialState: {
  nodeStateArr: NodeStateType[],
  filesDataArr: FileDataType[],
  edges: Edge[],
  currentY: number,
  currentIndex: number,
  noOfDataFiles: number,
  showResults: boolean,
  currentNode?: NodeStateType,
  saveWorkflow: boolean
} = {
  nodeStateArr: [],
  filesDataArr: [],
  edges: [],
  currentY: 0,
  currentIndex: 0,
  noOfDataFiles: 0,
  showResults: false,
  currentNode: undefined,
  saveWorkflow: false,
};

const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    addFile(state, action: PayloadAction<{
      fileName: string;
      filePath: string;
      positionX: number;
    }>) {
      const currentInd = state.currentIndex;
      state.nodeStateArr.push({
        nodeType: 'data' as NodeType,
        id: currentInd + 1,
        fileName: action.payload.fileName,
        filePath: action.payload.filePath,
        position: {
          x: state.noOfDataFiles * 200 + action.payload.positionX,
          y: 100,
        },
        isLeafNode: true,
      });
      state.currentY = 100;
      state.currentIndex = currentInd + 1;
      state.noOfDataFiles += 1;
    },
    addExistingFile(state, action: PayloadAction<{
      fileName: string;
      filePath: string;
      id: number;
      isLeafNode: boolean;
      position: { x: number; y: number }
    }>) {
      state.nodeStateArr.push({
        nodeType: 'data' as NodeType,
        id: action.payload.id,
        fileName: action.payload.fileName,
        filePath: action.payload.filePath,
        position: action.payload.position,
        isLeafNode: action.payload.isLeafNode,
      });
      state.noOfDataFiles += 1;
    },
    addData(state, action: PayloadAction<FileDataType>) {
      return {
        ...state,
        filesDataArr: [...state.filesDataArr, {
          data: action.payload.data,
          fileName: action.payload.fileName,
          columnNames: action.payload.columnNames,
        }],
      };
    },
    addEdges(state, action: PayloadAction<{ edges: Edge[] }>) {
      return {
        ...state,
        edges: action.payload.edges,
      };
    },
    initFunction(state, action: PayloadAction<{ methodName: MethodType; positionX: number }>) {
      const currentYIndex = state.currentY;
      const currentInd = state.currentIndex;
      const x = {
        nodeStateArr: [...state.nodeStateArr, {
          nodeType: 'method' as NodeType,
          id: currentInd + 1,
          methodName: action.payload.methodName,
          columnName: '',
          fileName: '',
          filePath: '',
          orderType: 'asc' as OrderType,
          position: {
            x: action.payload.positionX,
            y: currentYIndex + 120,
          },
          isLeafNode: false,
          condition: 'eq' as ConditionTypes,
          value: -1,
        }],
        currentY: currentYIndex + 120,
        currentIndex: currentInd + 1,
      };
      return {
        ...state,
        ...x,
      };
    },
    sort(state, action: PayloadAction<{ id: number; columnName: string; orderType: OrderType }>) {
      const currentObj = JSON.parse(
        JSON.stringify(state.nodeStateArr.find((node) => node.id === action.payload.id)),
      );
      const index = state.nodeStateArr.findIndex((node) => node.id === action.payload.id);
      currentObj.columnName = action.payload.columnName;
      currentObj.orderType = action.payload.orderType;
      state.nodeStateArr[index] = currentObj;
    },
    filter(state, action: PayloadAction<{
      id: number;
      columnName: string;
      condition: ConditionTypes;
      value: number | string;
    }>) {
      const currentObj = JSON.parse(
        JSON.stringify(state.nodeStateArr.find((node) => node.id === action.payload.id)),
      );
      const index = state.nodeStateArr.findIndex((node) => node.id === action.payload.id);
      currentObj.columnName = action.payload.columnName;
      currentObj.condition = action.payload.condition;
      currentObj.value = action.payload.value;
      state.nodeStateArr[index] = currentObj;
    },
    addAction(state, action: PayloadAction<ActionType>) {
      state.nodeStateArr.push({
        nodeType: 'method',
        id: action.payload.id!,
        position: action.payload.position,
        methodName: action.payload.methodName,
        columnName: action.payload.columnName,
        fileName: action.payload.fileName,
        filePath: action.payload.filePath,
        orderType: action.payload.orderType,
        condition: action.payload.condition,
        value: action.payload.value,
        isLeafNode: action.payload.isLeafNode,
      });
    },
    setLeafNodeType(state, action: PayloadAction<{ node: NodeStateType, isLeafNode: boolean }>) {
      const matchingNode = state.nodeStateArr.filter(
        (nodeElem) => nodeElem.id === action.payload.node.id,
      )[0];
      if (matchingNode === undefined) { return state; }
      const n = JSON.parse(JSON.stringify(matchingNode));
      const nodeArr = [...state.nodeStateArr];
      const index = state.nodeStateArr.findIndex(
        (nodeElem) => nodeElem.id === action.payload.node.id,
      );
      n.isLeafNode = action.payload.isLeafNode;
      nodeArr[index] = n;
      return {
        ...state,
        nodeStateArr: nodeArr,
      };
    },
    addNewFile: (state, action: PayloadAction<FileDataType>) => {
      const x = state.filesDataArr;
      x.push({
        data: action.payload.data,
        fileName: action.payload.fileName,
        columnNames: action.payload.columnNames,
      });
      return {
        ...state,
        filesDataArr: x,
      };
    },
    changeShowResults: (state, action: PayloadAction<{ x: boolean }>) => ({
      ...state,
      showResults: action.payload.x,
    }),
    changeCurrentNode: (state, action: PayloadAction<{ x: NodeStateType }>) => ({
      ...state,
      currentNode: action.payload.x,
    }),
    saveCurrentWorkflow: (state, action: PayloadAction<{ x: boolean }>) => {
      state.saveWorkflow = action.payload.x;
    },
    clearAll() {
      return {
        ...initialState,
      };
    },
  },
});

export const {
  addFile,
  addExistingFile,
  addData,
  addEdges,
  initFunction,
  addAction,
  sort,
  filter,
  changeShowResults,
  setLeafNodeType,
  changeCurrentNode,
  saveCurrentWorkflow,
  clearAll,
} = nodeSlice.actions;
export default nodeSlice.reducer;
