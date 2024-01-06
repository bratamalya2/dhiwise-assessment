import { Edge } from 'reactflow';
import ParentNodeUtils from './ParentNodeUtils';

import { NodeStateType } from '../types/nodeReducer';
import { MethodType } from '../types/methodTypes';
import { FileDataType } from '../types/fileDataTypes';

class DataOperationUtils {
  static applyFunctionToData({
    methodName, currentNode, filesData, edges, nodeArr,
  }: {
    methodName: MethodType;
    currentNode: NodeStateType;
    filesData: FileDataType[];
    edges: Edge[];
    nodeArr: NodeStateType[]
  }): any[] {
    if (currentNode.nodeType === 'data') {
      const { fileName } = currentNode;
      return filesData.find((fileData) => fileData.fileName === fileName)!.data;
    }
    const parentNodeIds = ParentNodeUtils.getParentNodeIds(currentNode, edges);
    const parentNodes = parentNodeIds.map((node) => ParentNodeUtils.getNodeFromId(node, nodeArr));
    const parentData = this.applyFunctionToData({
      methodName: parentNodes[0].methodName!,
      currentNode: parentNodes[0],
      filesData,
      edges,
      nodeArr,
    });
    // assuming only 1 parent
    const columnName: string = currentNode.columnName!;
    let tmpArr: Array<any> = [...parentData];
    const { orderType } = currentNode;
    const { condition } = currentNode;
    const { value } = currentNode;
    let v: number;
    switch (methodName) {
      case 'filter':
        switch (condition) {
          case 'eq':
            return parentData.filter((data: any) => data[columnName].toString() === value);
          case 'gt':
            if (typeof value === 'string') { v = parseFloat(value); } else if (typeof value === 'number') { v = value; }
            return parentData.filter((data: any) => data[columnName] > v);
          case 'lt':
            if (typeof value === 'string') { v = parseFloat(value); } else if (typeof value === 'number') { v = value; }
            return parentData.filter((data: any) => data[columnName] < v);
          case 'includes':
            return parentData.filter((data: any) => data[columnName].toString().includes(value));
          case 'neq':
            return parentData.filter((data: any) => data[columnName].toString() !== value);
          case 'notincludes':
            return parentData.filter((data: any) => !data[columnName].toString().includes(value));
          default:
            return parentData;
        }

      case 'sort':
        switch (orderType) {
          case 'asc':
            tmpArr = tmpArr.sort((a, b) => a[columnName] - b[columnName]);
            return tmpArr;
          case 'desc':
            tmpArr = tmpArr.sort((a, b) => b[columnName] - a[columnName]);
            return tmpArr;
          default:
            return parentData;
        }
      default:
        return parentData;
    }
  }

  static getColumnNames({
    node, edges, nodeArr, filesDataArr,
  }: {
    node: NodeStateType;
    edges: Edge[];
    nodeArr: NodeStateType[];
    filesDataArr: FileDataType[]
  }): string[] {
    if (node === undefined) { return []; }
    if (node.nodeType === 'data') {
      const file = filesDataArr.find((fData) => fData.fileName === node.fileName);
      return file?.columnNames!;
    }
    const parentNodeIds = ParentNodeUtils.getParentNodeIds(node, edges);
    const parentNode = ParentNodeUtils.getNodeFromId(parentNodeIds[0], nodeArr);
    return this.getColumnNames({
      node: parentNode, edges, nodeArr, filesDataArr,
    });
  }
}

export default DataOperationUtils;
