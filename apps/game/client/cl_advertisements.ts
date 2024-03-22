import { RegisterNuiProxy } from "./cl_utils";
import { AdvertisementsEvents } from "@typings/advertisements";

RegisterNuiProxy(AdvertisementsEvents.FETCH_ADVERTISEMENTS);
