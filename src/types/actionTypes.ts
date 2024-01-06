import { MethodType } from './methodTypes';
import { ConditionTypes } from './conditionTypes';
import { OrderType } from './orderTypes';

export interface ActionType {
  id: number;
  position: { x: number; y: number };
  methodName: MethodType;
  columnName: string;
  fileName: string;
  filePath: string;
  orderType: OrderType;
  condition: ConditionTypes;
  value: number | string;
  isLeafNode: boolean;
}
