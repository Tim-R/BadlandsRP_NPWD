import { RegisterNuiProxy } from "./cl_utils";
import { Advertisement, AdvertisementsEvents } from "@typings/advertisements";
import { sendAdvertisementsMessage } from "../utils/messages";
import { Location } from "@typings/common";

RegisterNuiProxy(AdvertisementsEvents.FETCH_ADVERTISEMENTS);
RegisterNuiProxy(AdvertisementsEvents.FETCH_MY_ADVERTISEMENTS);
RegisterNuiProxy(AdvertisementsEvents.BUMP_AD);
RegisterNuiProxy(AdvertisementsEvents.DELETE_AD);
RegisterNuiProxy(AdvertisementsEvents.EDIT_AD);
RegisterNuiProxy(AdvertisementsEvents.CREATE_AD);

onNet(AdvertisementsEvents.BUMP_AD_BROADCAST, (advertisement: Advertisement) => {
  sendAdvertisementsMessage(AdvertisementsEvents.BUMP_AD_BROADCAST, advertisement);
});

onNet(AdvertisementsEvents.DELETE_AD_BROADCAST, (adId: number) => {
  sendAdvertisementsMessage(AdvertisementsEvents.DELETE_AD_BROADCAST, adId);
});

onNet(AdvertisementsEvents.EDIT_AD_BROADCAST, (data: { adId: number, business?: string, body: string, phone?: string, location?: Location }) => {
  sendAdvertisementsMessage(AdvertisementsEvents.EDIT_AD_BROADCAST, data);
});

onNet(AdvertisementsEvents.CREATE_AD_BROADCAST, (advertisement: Advertisement) => {
  sendAdvertisementsMessage(AdvertisementsEvents.CREATE_AD_BROADCAST, advertisement);
});
