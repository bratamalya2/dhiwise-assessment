import { Edge } from 'reactflow';

import { NodeStateType } from '../types/nodeReducer';

class ParentNodeUtils {
  static getParentNodeIds(currentNode: NodeStateType, edges: Edge[]) {
    const parentNodeIds: number[] = [];
    edges.forEach((e) => {
      if (e.target === currentNode.id.toString()) {
        parentNodeIds.push(parseInt(e.source, 10));
      }
    });
    return parentNodeIds;
  }

  static getChildNodes(currentNode: NodeStateType, edges: Edge[]) {
    const parentNodeIds: number[] = [];
    edges.forEach((e) => {
      if (e.source === currentNode.id.toString()) {
        parentNodeIds.push(parseInt(e.target, 10));
      }
    });
    return parentNodeIds;
  }

  static getNodeFromId(currentNodeId: number | string, nodeArr: NodeStateType[]) {
    if (typeof currentNodeId === 'number') { return nodeArr.filter((node) => node.id === currentNodeId)[0]; }
    return nodeArr.filter((node) => node.id === parseInt(currentNodeId, 10))[0];
  }

  static getDeletedNodes(prevNodeArr: NodeStateType[], currNodeArr: NodeStateType[]) {
    const currentIds = currNodeArr.map((node) => node.id);
    return prevNodeArr.filter((node) => !currentIds.includes(node.id));
  }
}

export default ParentNodeUtils;
