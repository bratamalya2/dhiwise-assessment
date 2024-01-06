import React, { useCallback, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

import ReactFlow, {
  useNodesState, useEdgesState, addEdge, Node, Edge, Connection, Background,
} from 'reactflow';
import 'reactflow/dist/style.css';

import FunctionLabel from './functionLabel';

import {
  addExistingFile, addEdges, addAction, changeShowResults, setLeafNodeType, changeCurrentNode, saveCurrentWorkflow, clearAll,
} from '../store/nodeSlice';
import { useNodeDispatch, useNodeSelector } from '../store/hooks';

import ParentNodeUtils from '../utils/ParentNodeUtils';

import { ActionType } from '../types/actionTypes';
import { NodeStateType } from '../types/nodeReducer';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function RightPanel() {
  const nodeDispatch = useNodeDispatch();
  const currentNodeArr = useNodeSelector((state) => state.node.nodeStateArr);
  const filesDataArr = useNodeSelector((state) => state.node.filesDataArr);
  const saveWorkFlow = useNodeSelector((state) => state.node.saveWorkflow);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addFileToFlowFunc = useCallback((
    fileName: string,
    filePath: string,
    position: { x: number, y: number },
    id: number,
    isLeafNode: boolean,
  ) => {
    nodeDispatch(addExistingFile({
      fileName, filePath, position, id, isLeafNode,
    }));
  }, [nodeDispatch]);

  const addActionToFlowFunc = ({
    id,
    position,
    methodName,
    columnName,
    fileName,
    filePath,
    orderType,
    condition,
    value,
    isLeafNode,
  }: ActionType) => {
    nodeDispatch(addAction({
      id, position, methodName, columnName, fileName, filePath, orderType, condition, value, isLeafNode,
    }));
  };

  const setLeafNodeTypeFunc = useCallback((node: NodeStateType, isLeafNode: boolean) => {
    nodeDispatch(setLeafNodeType({ node, isLeafNode }));
  }, [nodeDispatch]);

  useEffect(() => {
    setNodes(() => currentNodeArr.map((elem: NodeStateType) => {
      if (elem.nodeType === 'data') {
        return {
          id: elem.id.toString(),
          position: elem.position,
          data: {
            label: (
              <div>
                <p>
                  File name:
                  {elem.fileName}
                </p>
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
              </div>
            ),
          },
          deletable: true,
          focusable: true,
        };
      }
      return {
        id: elem.id.toString(),
        position: elem.position,
        data: {
          label: (
            <FunctionLabel elem={elem} filesDataArr={filesDataArr} edges={edges} />
          ),
        },
        deletable: true,
        focusable: true,
      };
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNodeArr, nodeDispatch, setNodes]);

  useEffect(() => {
    const nodeIdArr = nodes.map((node) => parseInt(node.id, 10));
    const newNodeStateArr = currentNodeArr.filter((nodeObj: NodeStateType) => nodeIdArr.includes(nodeObj.id));
    if (nodeIdArr.length !== currentNodeArr.length) {
      nodeDispatch(clearAll());
    } else { return; }
    newNodeStateArr.forEach((node: NodeStateType) => {
      if (node.nodeType === 'data') { addFileToFlowFunc(node.fileName!, node.filePath!, node.position, node.id, node.isLeafNode); } else {
        addActionToFlowFunc({
          id: node.id,
          position: node.position,
          methodName: node.methodName!,
          columnName: node.columnName!,
          fileName: node.fileName!,
          filePath: node.filePath!,
          orderType: node.orderType!,
          condition: node.condition!,
          value: node.value!,
          isLeafNode: node.isLeafNode!,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, nodeDispatch, addFileToFlowFunc]);

  useEffect(() => {
    // set leaf nodes to non-leaf nodes if they have a child node
    // for each node -> check if it has leaf nodes
    // if leaf node is present -> set isLeafNode to false else set isLeafNode to true
    if (currentNodeArr.length) {
      currentNodeArr.forEach((node) => {
        const n = ParentNodeUtils.getNodeFromId(node.id, currentNodeArr);
        if (ParentNodeUtils.getChildNodes(node, edges).length > 0) {
          setLeafNodeTypeFunc(n, false);
        } else {
          setLeafNodeTypeFunc(n, true);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edges, setLeafNodeTypeFunc]);

  useEffect(() => {
    nodeDispatch(addEdges({ edges }));
  }, [edges, nodeDispatch]);

  useEffect(() => {
    if (saveWorkFlow) {
      const id = uuid();
      const str = JSON.stringify({
        edges,
        currentNodeArr,
        filesDataArr,
      });
      localStorage.setItem(id, str);
      nodeDispatch(saveCurrentWorkflow({ x: false }));
    }
  }, [saveWorkFlow, nodeDispatch, edges, currentNodeArr, filesDataArr]);

  return (
    <div className="w-[75vw] h-[100vh] border-2 border-s-indigo-500">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Background />
      </ReactFlow>
    </div>
  );
}
