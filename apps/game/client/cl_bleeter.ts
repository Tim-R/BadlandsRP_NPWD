import { BleeterEvents } from "@typings/bleeter";
import { RegisterNuiProxy } from "./cl_utils";
import { sendBleeterMessage } from "../utils/messages";

RegisterNuiProxy(BleeterEvents.FETCH_MY_ACCOUNTS);
RegisterNuiProxy(BleeterEvents.EDIT_ACCOUNT);
RegisterNuiProxy(BleeterEvents.DELETE_ACCOUNT);
RegisterNuiProxy(BleeterEvents.FETCH_ACCOUNT_USERS);
RegisterNuiProxy(BleeterEvents.CREATE_ACCOUNT);
RegisterNuiProxy(BleeterEvents.SET_ACCOUNT_ACTIVE);
RegisterNuiProxy(BleeterEvents.DELETE_ACCOUNT_USER);
RegisterNuiProxy(BleeterEvents.ADD_ACCOUNT_USER);
RegisterNuiProxy(BleeterEvents.EDIT_ACCOUNT_USER);
RegisterNuiProxy(BleeterEvents.FETCH_BLEETS_HOME);
RegisterNuiProxy(BleeterEvents.DELETE_BLEET);

onNet(BleeterEvents.EDIT_ACCOUNT_BROADCAST, (data: { accountId: number, profileName: string, avatarUrl: string }) => {
  sendBleeterMessage(BleeterEvents.EDIT_ACCOUNT_BROADCAST, data);
});

onNet(BleeterEvents.DELETE_ACCOUNT_BROADCAST, (accountId: number) => {
  sendBleeterMessage(BleeterEvents.DELETE_ACCOUNT_BROADCAST, accountId);
});

onNet(BleeterEvents.DELETE_BLEET, (id: number) => {
  sendBleeterMessage(BleeterEvents.DELETE_BLEET, id);
});
