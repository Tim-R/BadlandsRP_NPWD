import { onNetPromise } from "../lib/PromiseNetEvents/onNetPromise";
import { Advertisement, AdvertisementsEvents } from "@typings/advertisements";
import { mainLogger } from '../sv_logger';
import AdvertisementsService from "./advertisements.service";

onNetPromise<void, Advertisement[]>(
  AdvertisementsEvents.FETCH_ADVERTISEMENTS,
  async (reqObj, resp) => {
    AdvertisementsService.handleFetchAdvertisements(reqObj, resp).catch((e) => {
      mainLogger.error(`Error occurred in fetch advertisements (${reqObj.source}), Error: ${e.message}`);
      resp({ status: 'error', errorMsg: 'INTERNAL_ERROR' });
    });
  },
);
