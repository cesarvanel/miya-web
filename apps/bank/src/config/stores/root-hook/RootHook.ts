import {
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import type {BankDispatch, BankRootState, BankStore } from "../store";


export const useBankDispatch = useDispatch.withTypes<BankDispatch>();
export const useBankSelector = useSelector.withTypes<BankRootState>();
export const useBankStore = useStore.withTypes<BankStore>();
