import { useNuiEvent } from "@common/hooks/useNuiEvent";
import { APP_BLEETER } from "../utils/constants";
import { useCallback } from "react";
import { BleeterEvents } from "@typings/bleeter";
import { useBleeterActions } from "./useBleeterActions";

export const useBleeterService = () => {
  const { editAccount, deleteAccount } = useBleeterActions();

  const handleEditAccount = useCallback((data: { accountId: number, profileName: string, avatarUrl: string }) => {
    editAccount(data);
  }, [editAccount]);

  const handleDeleteAccount = useCallback((accountId: number) => {
    deleteAccount(accountId);
  }, [deleteAccount]);

  useNuiEvent(APP_BLEETER, BleeterEvents.EDIT_ACCOUNT_BROADCAST, handleEditAccount);
  useNuiEvent(APP_BLEETER, BleeterEvents.DELETE_ACCOUNT_BROADCAST, handleDeleteAccount);
}
