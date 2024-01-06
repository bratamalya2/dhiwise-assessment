import { NodeType } from './nodeTypes';
import { MethodType } from './methodTypes';
import { OrderType } from './orderTypes';
import { ConditionTypes } from './conditionTypes';

export interface NodeStateType {
  nodeType: NodeType;
  id: number;
  position: {
    x: number;
    y: number;
  };
  methodName?: MethodType;
  columnName?: string;
  fileName?: string;
  filePath?: string;
  orderType?: OrderType;
  condition?: ConditionTypes;
  value?: number | string;
  isLeafNode: boolean;
}
