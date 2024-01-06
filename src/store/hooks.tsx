import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { AppDispatchType, RootStateType } from './store';

type DispatchFunction = () => AppDispatchType;

export const useNodeDispatch: DispatchFunction = useDispatch;
export const useNodeSelector: TypedUseSelectorHook<RootStateType> = useSelector;
