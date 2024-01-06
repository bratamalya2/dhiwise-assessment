import { ActionType } from './actionTypes';

export type AddDataToFlowType = ((x: string) => void) | null;

export type AddActionToFlowType = ((x: ActionType) => void) | null;
