import { useDispatch, useSelector, useStore } from 'react-redux';
import type { PlatformDispatch, PlatformRootState, PlatformStore } from './store';

export const usePlatformDispatch = useDispatch.withTypes<PlatformDispatch>();
export const usePlatformSelector = useSelector.withTypes<PlatformRootState>();
export const usePlatformStore = useStore.withTypes<PlatformStore>();
